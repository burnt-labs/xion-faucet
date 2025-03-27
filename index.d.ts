declare module 'nuxt/schema' {
    interface RuntimeConfig {
        discord: DiscordConfig;
        kvStore: KVNamespace;
        faucet: WalletConfig;
        "xion-testnet-1": WalletConfig;
        "xion-testnet-2": WalletConfig;
        turnstile: {
            secretKey: string;
        };
    }
    interface PublicRuntimeConfig {
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
        chainId: string;
        cooldownTime: number;
        denom: string;
        gasLimit: string;
        gasPrice: string;
        logging: string;
        memo: string;
        rpcUrl: string;
        tokens: string;
    }

    interface WalletConfig {
        mnemonic: string;
        pathPattern: string;
    }

    interface ChainConfig {
        address: string;
        rpcUrl: string;
    }

    interface DiscordConfig {
        publicKey: string;
        appId: string;
        token: string;
        guildId: string;
    }

    interface DiscordUserData {
        username: string;
        discriminator?: string;
        // Add other properties as needed
    }
}

// It is always important to ensure you import/export something when augmenting a type
export { }
