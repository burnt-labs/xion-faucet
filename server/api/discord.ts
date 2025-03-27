import { StargateClient } from '@cosmjs/stargate';
import { getAvailableTokens, getWallet } from '../utils/utils';
import { parseBankTokens } from '@cosmjs/faucet/build/tokens';
import { ChainConfig } from 'nuxt/schema';
import {
    InteractionType,
    InteractionResponseType,
    MessageComponentTypes,
    ButtonStyleTypes,
    verifyKeyMiddleware,
} from 'discord-interactions';

export interface FaucetRequestBody {
    readonly type: InteractionType;
    readonly data: any
}


export default defineEventHandler(async (event) => {
    const body: FaucetRequestBody = await event.context.cloudflare.request.json()
    const { type, data } = body
    console.log("Discord interaction:", type, data)
    /**
     * Handle slash command requests
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
        // Slash command with name of "faucet"
        if (data.name === 'faucet') {
            // Send a message as response
            return new Response({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: { content: 'Please use https://faucet.testnet.burnt.com' },
            });
        }
    }
})
