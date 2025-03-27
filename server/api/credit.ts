import { ChainConfig, FaucetConfig, RuntimeConfig, WalletConfig } from 'nuxt/schema';
import { getFaucet } from '../utils/faucet';
import { isValidAddress } from "../utils/utils";
import { HttpError as CosmjsHttpError } from "@cosmjs/faucet/build/api/httperror";

export interface CreditRequestBody {
    readonly denom: string;
    readonly address: string;
    readonly token: string;
}

export class HttpError extends CosmjsHttpError {
    readonly status: number;
    readonly message: string;
    readonly expose: boolean;
    constructor(message: string, status: number, expose?: boolean) {
        super(status, message, expose);
        this.message = message;
        this.status = status;
        this.expose = expose ?? true;
    }
}

const getAcountId = async (kvStore: KVNamespace): Promise<number> => {
    const acctNum = Math.floor(Math.random() * 15) + 1;
    const acctKey = `account${acctNum.toString().padStart(3, "0")}`;
    const entry = await kvStore.getWithMetadata(acctKey);
    if (entry.value === null) {
        await kvStore.put(acctKey, new Date().toISOString(), { expirationTtl: 60 });
        return acctNum
    }
    return await getAcountId(kvStore);
}

//export const onRequest: PagesFunction<Env> = async (context): Promise<Response> => {
export default defineEventHandler(async (event) => {
    try {

        if (event.method !== "POST") {
            throw new HttpError("This endpoint requires a POST request", 405);
        }

        if (event.headers.get("Content-Type") !== "application/json") {
            throw new HttpError("Content-type application/json expected", 415);
        }

        const creditBody = await readBody(event) as unknown as CreditRequestBody;
        const { address, denom, token } = creditBody;

        if (!token) {
            throw createError({
                statusCode: 422,
                statusMessage: 'Token not provided.',
            })
        }

        const verified = await verifyTurnstileToken(token, event)
        if (!verified.success) {
            throw createError({
                statusCode: 422,
                statusMessage: 'Token not verified.',
            })
        }
        const runtimeConfig = useRuntimeConfig(event);
        const ipAddress = getRequestIP(event, { xForwardedFor: true });
        const url = getRequestURL(event);
        const chainId = url.searchParams.get("chainId");
        if (!chainId) {
            throw new HttpError("Missing chainId parameter", 400);
        }
        const identifiers = ipAddress ? [address, ipAddress] : [address];
        const resultMod = await creditAccount(runtimeConfig, address, denom, chainId, identifiers);

        return new Response(JSON.stringify(resultMod), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (e) {
        console.error(e);
        if (e instanceof HttpError) {
            return new Response(JSON.stringify(e), {
                status: e.status,
                headers: { "Content-Type": "application/json" }
            });
        }
        return new Response(JSON.stringify(new HttpError(`Sending tokens failed: ${e}`, 500)), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
});

export const creditAccount = async (runtimeConfig: RuntimeConfig, address: string, denom: string, chainId: string, identifiers: string[]) => {
    const faucetConfig = getChainFaucetConfig(runtimeConfig, chainId);
    const { addressPrefix, cooldownTime } = faucetConfig

    if (!isValidAddress(address, addressPrefix)) {
        throw new HttpError("Address is not in the expected format for this chain.", 400);
    }

    const kvStore = runtimeConfig.kvStore as KVNamespace;
    if (address !== faucetConfig.address) {
        await checkKvStore(kvStore, cooldownTime, identifiers);
    }

    const { mnemonic, pathPattern } = getWalletConfig(runtimeConfig, chainId);
    const accountId = await getAcountId(kvStore);
    const faucet = await getFaucet(faucetConfig, mnemonic, pathPattern, accountId);
    const availableTokens = await faucet.availableTokens()
    const matchingDenom = availableTokens.find(
        (availableDenom: string) => availableDenom === denom
    );

    if (!matchingDenom) {
        throw new HttpError(`There are no ${denom} tokens available from ${faucet.address}`, 422);
    }

    // Failure will throw
    const result = await faucet.credit(address, matchingDenom);
    const convertedAmount = {
        amount: (parseInt(result.amount.amount) / 1000000).toString(),
        denom: result.amount.denom.startsWith('u') ? result.amount.denom.slice(1) : result.amount.denom
    };

    const resultMod = {
        ...result,
        convertedAmount
    };

    if (address !== faucetConfig.address) {
        for (const identifier of identifiers) {
            await kvStore.put(identifier, new Date().toISOString(), { expirationTtl: cooldownTime });
        }
    }

    return resultMod;
};

const checkKvStore = async (kvStore: KVNamespace, cooldownTime: number, identifiers: string[]) => {
    for (const identifier in identifiers) {
        const addEntry = await kvStore.get(identifier);
        if (addEntry === null) {
            const entryDate = new Date(identifier);
            const currentDate = new Date();
            const cooldownEnd = new Date(entryDate.getTime() + cooldownTime * 1000);
            const remainingTime = Math.ceil((cooldownEnd.getTime() - currentDate.getTime()) / 1000);

            const hours = Math.floor(remainingTime / 3600);
            const minutes = Math.floor((remainingTime % 3600) / 60);
            const seconds = remainingTime % 60;

            const humanReadableTime = `${hours}h ${minutes}m ${seconds}s`;

            throw new HttpError(`Too many requests for the same address (${identifier}). Please wait ${humanReadableTime} and try again!`, 405);
        }
    }
}

const getChainFaucetConfig = (runtimeConfig: RuntimeConfig, chainId: string): FaucetConfig => {
    const faucetConfig = runtimeConfig.public.faucet;

    if (chainId) {
        const chainConfig = runtimeConfig.public[chainId] as unknown as ChainConfig;
        if (!chainConfig || !chainConfig.rpcUrl || !chainConfig.address) {
            throw new HttpError(`Configuration for chainIdParam ${chainId} is missing or incomplete`, 400);
        }
        faucetConfig.rpcUrl = chainConfig.rpcUrl;
        faucetConfig.address = chainConfig.address;
    }
    return faucetConfig;
}

const getWalletConfig = (runtimeConfig: RuntimeConfig, chainId: string): WalletConfig => {
    if (chainId && runtimeConfig[chainId]) {
        return runtimeConfig[chainId] as unknown as WalletConfig;
    }
    return runtimeConfig.faucet as unknown as WalletConfig;
}
