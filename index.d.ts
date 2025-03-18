declare module 'nuxt/schema' {
    interface RuntimeConfig {
        faucet: {
            mnemonic: string;
            pathPattern: string;
            kvStore: KVNamespace;
        };
        chains: {
            [chain_id]: {
                mnemonic: string;
            };
        }
        turnstile: {
            secretKey: string;
        };
    }
    interface PublicRuntimeConfig {
        sendImage: string;
        faucet: FaucetConfig;
        chains: {
            [chain_id]: ChainConfig;
        };
        turnstile: {
            siteKey: string;
        };
    }
    interface FaucetConfig {
        address: string;
        addressPrefix: string;
        amountGiven: number;
        cooldownTime: number;
        denom: string;
        gasLimit: string;
        gasPrice: string;
        logging: string;
        memo: string;
        rpcUrl: string;
        tokens: string;
    }

    interface ChainConfig {
        address: string;
        rpcUrl: string;
    }
}

// It is always important to ensure you import/export something when augmenting a type
export { }
