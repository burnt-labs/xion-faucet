import { fromBech32 } from "@cosmjs/encoding";
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { isDefined } from "@cosmjs/utils";
import { makePathBuilder } from "@cosmjs/faucet/build/pathbuilder";
import { Secp256k1HdWallet } from "@cosmjs/amino";
import type { OfflineSigner } from "@cosmjs/proto-signing";

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

