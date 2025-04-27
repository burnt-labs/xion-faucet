declare module 'nuxt/schema' {
    interface RuntimeConfig {
        discord: DiscordConfig;
        faucet: WalletConfig;
        kvStore: KVNamespace;
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
    }
    interface FaucetConfig {
        address: string;
        addressPrefix: string;
        amountGiven: number;
        chainId: string;
        cooldownTime: number;
        denoms: string;
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
        kvStore: KVNamespace | string;
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
