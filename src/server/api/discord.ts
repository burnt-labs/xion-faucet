import { creditAccount, HttpError } from './credit';
import { verifyKey, InteractionType, InteractionResponseType } from 'discord-interactions';

export default defineEventHandler(async (event) => {
    try {
        if (event.method !== "POST") {
            throw new HttpError("This endpoint requires a POST request", 405);
        }

        if (event.headers.get("Content-Type") !== "application/json") {
            throw new HttpError("Content-type application/json expected", 415);
        }

        const runtimeConfig = useRuntimeConfig(event);
        const { publicKey } = runtimeConfig.discord;

        const signature = event.headers.get("X-Signature-Ed25519");
        const timestamp = event.headers.get("X-Signature-Timestamp");

        const body = await readRawBody(event, false);

        if (!body) {
            throw new HttpError("No body found", 400);
        }

        const isValidRequest = await verifyKey(
            body,
            signature!,
            timestamp!,
            publicKey
        );

        if (!isValidRequest) {
            throw new HttpError("Invalid request signature", 415);
        }

        const json = JSON.parse(body.toString('utf8'));
        return handleInteraction(json, event);

    } catch (e) {
        console.error(e);
        if (e instanceof HttpError) {
            return Response.json(e, {
                status: e.status,
                headers: { "Content-Type": "application/json" }
            });
        }
        return Response.json(new HttpError(`Error: ${e}`, 500), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
})

// Interaction handler function to replace the switch statement
async function handleInteraction(interaction: any, event: any) {
    const runtimeConfig = useRuntimeConfig(event);

    // Handle ping
    if (interaction.type === InteractionType.PING) {
        return Response.json({ type: InteractionResponseType.PONG }, {
            status: 200,
        });
    }

    // Handle application commands
    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
        const username = `${interaction.member.user.username}#${interaction.member.user.discriminator}`;
        console.log(`Handle command: ${interaction.data.name} from user: ${username}`);

        if (interaction.data.name === "faucet") {
            return handleFaucetCommand(interaction, event);
        }
    }

    throw new HttpError("Unknown interaction", 400);
}

async function handleFaucetCommand(interaction: any, event: any) {
    const options = interaction.data.options
    const address = options.find((opt: any) => opt.name === "address")?.value;
    const runtimeConfig = useRuntimeConfig(event)
    const denom = runtimeConfig.public.faucet.denoms;
    const chainId = runtimeConfig.public.faucet.chainId;
    const mention = `<@${interaction.member.user.id}>`;
    const identifiers = [address, interaction.member.user.id];

    try {
        const res = await creditAccount(event, address, denom, chainId, identifiers)
        // Follow-up would need to be implemented with a webhook
        // This is simplified for this example
        return Response.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `${mention} We sent ${res.amount.amount}${res.amount.denom} to address: ${res.recipient}, tx hash: ${res.transactionHash}`,
            }
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return Response.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `${mention} We couldn't send funds: ${errorMessage}`
            }
        });
    }
}
