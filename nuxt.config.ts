import colors from "vuetify/util/colors";
import { defineNuxtConfig } from 'nuxt/config'

const getEnvVar = <T>(key: string, defaultValue?: T): T => {
  const value = process.env[key] !== undefined ? process.env[key] : defaultValue;
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set and no default value provided`);
  }
  return value as T;
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  nitro: {
    preset: "cloudflare-pages"
  },

  modules: [
    "nitro-cloudflare-dev",
    'vuetify-nuxt-module',
    '@nuxtjs/turnstile',
  ],
  turnstile: {
    siteKey: getEnvVar("NUXT_PUBLIC_TURNSTILE_SITE_KEY"),
  },

  runtimeConfig: {
    kvStore: getEnvVar<KVNamespace>("NUXT_FAUCET_KV"),
    discord: {
      appId: getEnvVar("NUXT_DISCORD_APP_ID"),
      token: getEnvVar("NUXT_DISCORD_TOKEN"),
      publicKey: getEnvVar("NUXT_DISCORD_PUBLIC_KEY"),
      guildId: getEnvVar("NUXT_DISCORD_GUILD_ID"),
    },
    faucet: {
      mnemonic: getEnvVar("NUXT_XION_TESTNET_2_MNEMONIC"),
      pathPattern: getEnvVar("NUXT_FAUCET_PATH_PATTERN"),
    },
    "xion-testnet-1": {
      mnemonic: getEnvVar("NUXT_XION_TESTNET_1_MNEMONIC"),
      pathPattern: getEnvVar("NUXT_FAUCET_PATH_PATTERN"),
    },
    "xion-testnet-2": {
      mnemonic: getEnvVar("NUXT_XION_TESTNET_2_MNEMONIC"),
      pathPattern: getEnvVar("NUXT_FAUCET_PATH_PATTERN"),
    },
    turnstile: {
      secretKey: getEnvVar("NUXT_TURNSTILE_SECRET_KEY"),
    },
    public: {
      faucet: {
        address: getEnvVar("NUXT_PUBLIC_XION_TESTNET_2_ADDRESS"),
        addressPrefix: getEnvVar("NUXT_PUBLIC_FAUCET_ADDRESS_PREFIX"),
        amountGiven: getEnvVar("NUXT_PUBLIC_FAUCET_AMOUNT_GIVEN"),
        chainId: getEnvVar("NUXT_PUBLIC_DEFAULT_CHAIN_ID"),
        cooldownTime: getEnvVar("NUXT_PUBLIC_FAUCET_COOLDOWN_TIME"),
        denom: getEnvVar("NUXT_PUBLIC_FAUCET_DENOM"),
        gasLimit: getEnvVar("NUXT_PUBLIC_FAUCET_GAS_LIMIT"),
        gasPrice: getEnvVar("NUXT_PUBLIC_FAUCET_GAS_PRICE"),
        logging: getEnvVar("NUXT_PUBLIC_FAUCET_LOGGING"),
        memo: getEnvVar("NUXT_PUBLIC_FAUCET_MEMO"),
        rpcUrl: getEnvVar("NUXT_PUBLIC_XION_TESTNET_2_RPC_URL"),
        tokens: getEnvVar("NUXT_PUBLIC_FAUCET_TOKENS"),
      },
      "xion-testnet-1": {
        address: getEnvVar("NUXT_PUBLIC_XION_TESTNET_1_ADDRESS"),
        rpcUrl: getEnvVar("NUXT_PUBLIC_XION_TESTNET_1_RPC_URL"),
      },
      "xion-testnet-2": {
        address: getEnvVar("NUXT_PUBLIC_XION_TESTNET_2_ADDRESS"),
        rpcUrl: getEnvVar("NUXT_PUBLIC_XION_TESTNET_2_RPC_URL"),
      }
    },
  },
  vuetify: {
    moduleOptions: {
    },
    vuetifyOptions: {
      theme: {
        defaultTheme: 'dark',
        themes: {
          dark: {
            colors: {
              primary: '#FE5000',
              accent: colors.grey.darken3,
              secondary: colors.amber.darken3,
              info: colors.teal.lighten1,
              warning: colors.amber.base,
              error: colors.deepOrange.accent4,
              success: colors.green.accent3,
            },
          },
        },
      },
    },
  },
})
