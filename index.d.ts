declare module 'nuxt/schema' {
    interface RuntimeConfig {
        faucet: {
            mnemonic: string;
            pathPattern: string;
            kvStore: KVNamespace;
        };
        "xion-testnet-1": {
            mnemonic: string;
        };
        "xion-testnet-2": {
            mnemonic: string;
        };
        turnstile: {
            secretKey: string;
        };
    }
    interface PublicRuntimeConfig {
        discord: DiscordConfig
        faucet: FaucetConfig;
        sendImage: string;
        turnstile: {
            siteKey: string;
        };
        "xion-testnet-1": ChainConfig;
        "xion-testnet-2": ChainConfig;
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

    interface DiscordConfig {
        publicKey: string;
    }
}

// It is always important to ensure you import/export something when augmenting a type
export { }
