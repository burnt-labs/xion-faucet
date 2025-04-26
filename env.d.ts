/// <reference types="@cloudflare/workers-types/2023-07-01" />
import { Env } from "./worker-configuration";

declare module "h3" {
  interface H3EventContext {
    cf: CfProperties;
    cloudflare: {
      request: Request;
      env: {
        NUXT_FAUCET_KV: KVNamespace;
        NUXT_DISCORD_TOKEN: string;
        NUXT_FAUCET_MNEMONIC: string;
        NUXT_XION_TESTNET_1_MNEMONIC: string;
        NUXT_XION_TESTNET_2_MNEMONIC: string;
        NUXT_FAUCET_PATH_PATTERN: string;
        NUXT_TURNSTILE_SECRET_KEY: string;
        NUXT_DISCORD_APP_ID: string;
        NUXT_DISCORD_GUILD_ID: string;
        NUXT_DISCORD_PUBLIC_KEY: string;
        NUXT_PUBLIC_DEFAULT_CHAIN_ID: string;
        NUXT_PUBLIC_FAUCET_ADDRESS: string;
        NUXT_PUBLIC_FAUCET_ADDRESS_PREFIX: string;
        NUXT_PUBLIC_FAUCET_AMOUNT_GIVEN: string;
        NUXT_PUBLIC_FAUCET_COOLDOWN_TIME: string;
        NUXT_PUBLIC_FAUCET_DENOM: string;
        NUXT_PUBLIC_FAUCET_GAS_LIMIT: string;
        NUXT_PUBLIC_FAUCET_GAS_PRICE: string;
        NUXT_PUBLIC_FAUCET_LOGGING: string;
        NUXT_PUBLIC_FAUCET_MEMO: string;
        NUXT_PUBLIC_FAUCET_RPC_URL: string;
        NUXT_PUBLIC_FAUCET_TOKENS: string;
        NUXT_PUBLIC_TURNSTILE_SITE_KEY: string;
        NUXT_PUBLIC_SEND_IMAGE: string;
        NUXT_PUBLIC_XION_TESTNET_1_ADDRESS: string;
        NUXT_PUBLIC_XION_TESTNET_2_ADDRESS: string;
        NUXT_PUBLIC_XION_TESTNET_1_RPC_URL: string;
        NUXT_PUBLIC_XION_TESTNET_2_RPC_URL: string;
        ASSETS: Fetcher;
      }
      context: ExecutionContext;
    };
  }
}

export { };
