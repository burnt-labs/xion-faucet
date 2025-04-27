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
    preset: "cloudflare_module",

    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
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
    discord: {
      appId: getEnvVar("NUXT_DISCORD_APP_ID"),
      token: getEnvVar("NUXT_DISCORD_TOKEN"),
      publicKey: getEnvVar("NUXT_DISCORD_PUBLIC_KEY"),
      guildId: getEnvVar("NUXT_DISCORD_GUILD_ID"),
    },
    faucet: {
      mnemonic: getEnvVar("NUXT_XION_TESTNET_2_MNEMONIC"),
      pathPattern: getEnvVar("NUXT_FAUCET_PATH_PATTERN"),
      kvStore: getEnvVar("NUXT_FAUCET_KV", ""),
    },
    public: {
      faucet: {
        address: getEnvVar("NUXT_PUBLIC_FAUCET_ADDRESS"),
        addressPrefix: getEnvVar("NUXT_PUBLIC_FAUCET_ADDRESS_PREFIX"),
        amountGiven: getEnvVar("NUXT_PUBLIC_FAUCET_AMOUNT_GIVEN"),
        chainId: getEnvVar("NUXT_PUBLIC_DEFAULT_CHAIN_ID"),
        cooldownTime: getEnvVar("NUXT_PUBLIC_FAUCET_COOLDOWN_TIME"),
        denoms: getEnvVar("NUXT_PUBLIC_FAUCET_DENOM"),
        gasLimit: getEnvVar("NUXT_PUBLIC_FAUCET_GAS_LIMIT"),
        gasPrice: getEnvVar("NUXT_PUBLIC_FAUCET_GAS_PRICE"),
        logging: getEnvVar("NUXT_PUBLIC_FAUCET_LOGGING"),
        memo: getEnvVar("NUXT_PUBLIC_FAUCET_MEMO"),
        rpcUrl: getEnvVar("NUXT_PUBLIC_FAUCET_RPC_URL"),
        tokens: getEnvVar("NUXT_PUBLIC_FAUCET_TOKENS"),
      },
      sendImage: getEnvVar("NUXT_PUBLIC_SEND_IMAGE"),
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
