import colors from "vuetify/util/colors";
import { defineNuxtConfig } from 'nuxt/config'

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
    siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY as string,
  },

  runtimeConfig: {
    faucet: {
      mnemonic: process.env.NUXT_FAUCET_MNEMONIC as string,
      pathPattern: process.env.NUXT_FAUCET_PATH_PATTERN as string,
      kvStore: process.env.NUXT_FAUCET_KV as unknown as KVNamespace,
    },
    turnstile: {
      secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY as string,
    },
    "xion-testnet-1": {
      mnemonic: process.env.NUXT_XION_TESTNET_1_MNEMONIC as string,
    },
    "xion-testnet-2": {
      mnemonic: process.env.NUXT_XION_TESTNET_2_MNEMONIC as string,
    },
    public: {
      faucet: {
        address: process.env.NUXT_PUBLIC_XION_TESTNET_2_ADDRESS as string,
        addressPrefix: process.env.NUXT_PUBLIC_FAUCET_ADDRESS_PREFIX as string,
        amountGiven: process.env.NUXT_PUBLIC_FAUCET_AMOUNT_GIVEN as unknown as number,
        cooldownTime: process.env.NUXT_PUBLIC_FAUCET_COOLDOWN_TIME as unknown as number,
        denom: process.env.NUXT_PUBLIC_FAUCET_DENOM as string,
        gasLimit: process.env.NUXT_PUBLIC_FAUCET_GAS_LIMIT as string,
        gasPrice: process.env.NUXT_PUBLIC_FAUCET_GAS_PRICE as string,
        logging: process.env.NUXT_PUBLIC_FAUCET_LOGGING as string,
        memo: process.env.NUXT_PUBLIC_FAUCET_MEMO as string,
        rpcUrl: process.env.NUXT_PUBLIC_XION_TESTNET_2_RPC_URL as string,
        tokens: process.env.NUXT_PUBLIC_FAUCET_TOKENS as string,
      },
      "xion-testnet-1": {
        address: process.env.NUXT_PUBLIC_XION_TESTNET_1_ADDRESS as string,
        rpcUrl: process.env.NUXT_PUBLIC_XION_TESTNET_1_RPC_URL as string,
      },
      "xion-testnet-2": {
        address: process.env.NUXT_PUBLIC_XION_TESTNET_2_ADDRESS as string,
        rpcUrl: process.env.NUXT_PUBLIC_XION_TESTNET_2_RPC_URL as string,
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
