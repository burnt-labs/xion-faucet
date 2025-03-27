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
import { HttpError } from './credit';

export interface FaucetRequestBody {
    readonly type: InteractionType;
    readonly data: any
}


export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event) as unknown as FaucetRequestBody;
        const { type, data } = body
        console.log("Discord interaction:", type, data)
        /**
         * Handle slash command requests
         */
        if (type === InteractionType.APPLICATION_COMMAND) {
            // Slash command with name of "faucet"
            if (data.name === 'faucet') {
                // Send a message as response
                return new Response(JSON.stringify({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: { content: 'Please use https://faucet.testnet.burnt.com' },
                }), { status: 200 });
            }
        }
    } catch (e) {
        console.error(e);
        if (e instanceof HttpError) {
            return new Response(JSON.stringify(e), {
                status: e.status,
                headers: { "Content-Type": "application/json" }
            });
        }
        return new Response(JSON.stringify(new HttpError(`Sending tokens failed: ${e}`, 500)), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
})
