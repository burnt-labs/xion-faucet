import { fromBech32 } from "@cosmjs/encoding";
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { isDefined } from "@cosmjs/utils";
import { makePathBuilder, PathBuilder } from "@cosmjs/faucet/build/pathbuilder";
import { Secp256k1HdWallet } from "@cosmjs/amino";
import { DirectSecp256k1HdWallet, OfflineSigner } from "@cosmjs/proto-signing";
import { MinimalAccount } from "@cosmjs/faucet/build/types";
import { pathToString } from "@cosmjs/crypto";

export function isValidAddress(input: string, requiredPrefix: string): boolean {
    try {
        const { prefix, data } = fromBech32(input);
        if (prefix !== requiredPrefix) {
            return false;
        }
        return data.length === 20 || data.length === 32;
    } catch {
        return false;
    }
}

export const loadAccounts = (client: StargateClient, addresses: string[]): Promise<readonly MinimalAccount[]> => {
    return Promise.all(addresses.map(async (address) => {
        const balance = await client.getAllBalances(address);
        return { address, balance };
    }));
}

export const getSigningClient = async (rpcUrl: string, mnemonic: string, pathPattern: string, addressPrefix: string, accountId: number): Promise<SigningStargateClient> => {
    const wallet = await getWallet(mnemonic, pathPattern, addressPrefix, accountId);
    return SigningStargateClient.connectWithSigner(rpcUrl, wallet);
}

export async function getWallet(mnemonic: string, pathPattern: string, addressPrefix: string, accountId: number): Promise<OfflineSigner> {
    // Construct the derivation path for the given account ID
    const pathBuilder = makePathBuilder(pathPattern);
    const derivationPath = pathBuilder(accountId)

    // Create a wallet instance using the Secp256k1HdWallet or other appropriate class
    const account = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
        hdPaths: [derivationPath],
        prefix: addressPrefix,
    });

    // Return the address of the specified account
    return account
}

export const getAvailableTokens = async (client: StargateClient, address: string, bankTokens: string[]): Promise<string[]> => {
    const balance = await client.getAllBalances(address);
    return balance
        .filter((b) => b.amount !== "0")
        .map((b) => bankTokens.find((token) => token === b.denom))
        .filter(isDefined);
}

export async function createWallets(
    mnemonic: string,
    pathBuilder: PathBuilder,
    addressPrefix: string,
    numberOfDistributors: number,
    logging: boolean,
): Promise<ReadonlyArray<readonly [string, OfflineSigner]>> {
    const wallets = new Array<readonly [string, OfflineSigner]>();

    // first account is the token holder
    const numberOfIdentities = +1 + +numberOfDistributors; // fix mishandled concat
    for (let i = 0; i < numberOfIdentities; i++) {
        const path = pathBuilder(i);
        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
            hdPaths: [path],
            prefix: addressPrefix,
        });
        const [{ address }] = await wallet.getAccounts();
        if (logging) {
            const role = i === 0 ? "Primary " : `Distributor ${i.toString().padStart(3, "0")}`;
            console.info(`${role} (${pathToString(path)}): ${address}`);
        }
        wallets.push([address, wallet]);
    }

    return wallets;
}
