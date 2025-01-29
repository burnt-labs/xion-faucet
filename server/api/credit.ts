import { ChainConfig } from 'nuxt/schema';
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

const getAcoountId = async (kvStore: KVNamespace): Promise<number> => {
    const acctNum = Math.floor(Math.random() * 15) + 1;
    const acctKey = `account${acctNum.toString().padStart(3, "0")}`;
    const entry = await kvStore.getWithMetadata(acctKey);
    if (entry.value === null) {
        await kvStore.put(acctKey, new Date().toISOString(), { expirationTtl: 60 });
        return acctNum
    }
    return await getAcoountId(kvStore);
}

//export const onRequest: PagesFunction<Env> = async (context): Promise<Response> => {
export default defineEventHandler(async (event) => {
    try {
        const kvStore = event.context.cloudflare.env.NUXT_FAUCET_KV
        const runtimeConfig = useRuntimeConfig(event);
        const faucetConfig = runtimeConfig.public.faucet;

        const url = new URL(event.context.cloudflare.request.url);
        const chainIdParam = url.searchParams.get("chainId");
        if (chainIdParam) {

            const chainConfig = runtimeConfig.public[chainIdParam] as unknown as ChainConfig;
            if (!chainConfig || !chainConfig.rpcUrl || !chainConfig.address) {
                throw new HttpError(`Configuration for chainIdParam ${chainIdParam} is missing or incomplete`, 400);
            }
            faucetConfig.rpcUrl = chainConfig.rpcUrl;
            faucetConfig.address = chainConfig.address;
        }

        const { addressPrefix, cooldownTime, address: faucetAddress } = faucetConfig
        const request = event.context.cloudflare.request;

        if (request.method !== "POST") {
            throw new HttpError("This endpoint requires a POST request", 405);
        }

        if (request.headers.get("Content-Type") !== "application/json") {
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

        if (!isValidAddress(address, addressPrefix)) {
            throw new HttpError("Address is not in the expected format for this chain.", 400);
        }

        const entry = await kvStore.get(address);
        if (entry !== null) {
            const entryDate = new Date(entry);
            const currentDate = new Date();
            const cooldownEnd = new Date(entryDate.getTime() + cooldownTime * 1000);
            const remainingTime = Math.ceil((cooldownEnd.getTime() - currentDate.getTime()) / 1000);

            const hours = Math.floor(remainingTime / 3600);
            const minutes = Math.floor((remainingTime % 3600) / 60);
            const seconds = remainingTime % 60;

            const humanReadableTime = `${hours}h ${minutes}m ${seconds}s`;

            throw new HttpError(`Too many requests for the same address. Blocked to prevent draining. Please wait ${humanReadableTime} and try again!`, 405);
        }

        const pathPattern = runtimeConfig.faucet.pathPattern;
        let mnemonic = runtimeConfig.faucet.mnemonic;
        if (chainIdParam && runtimeConfig[chainIdParam] && runtimeConfig[chainIdParam].mnemonic) {
            mnemonic = runtimeConfig[chainIdParam].mnemonic;
        }
        const accountId = await getAcoountId(kvStore);
        const faucet = await getFaucet(faucetConfig, mnemonic, pathPattern, accountId);
        const availableTokens = await faucet.availableTokens()
        const matchingDenom = availableTokens.find(
            (availableDenom: string) => availableDenom === denom
        );

        if (!matchingDenom) {
            throw new HttpError(`There are no ${denom} tokens available from ${faucet.address}`, 422);
        }

        // Failure will throe
        const result = await faucet.credit(address, matchingDenom);
        const convertedAmount = {
            amount: (parseInt(result.amount.amount) / 1000000).toString(),
            denom: result.amount.denom.startsWith('u') ? result.amount.denom.slice(1) : result.amount.denom
        };

        const resultMod = {
            ...result,
            convertedAmount
        };

        if (address !== faucetAddress) {
            await kvStore.put(address, new Date().toISOString(), { expirationTtl: cooldownTime });
        }

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

