declare module 'nuxt/schema' {
    interface RuntimeConfig {
        faucet: {
            mnemonic: string;
            pathPattern: string;
            kvStore: KVNamespace;
        };
        turnstile: {
            secretKey: string;
        };
    }
    interface PublicRuntimeConfig {
        sendImage: string;
        faucet: FaucetConfig;
        "xion-testnet-1": ChainConfig;
        "xion-testnet-2": ChainConfig;
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
