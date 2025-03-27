import { verifyKey } from 'discord-interactions';
import { HttpError } from './credit';
import { DiscordConfig } from 'nuxt/schema';


export default defineEventHandler(async (event) => {
    try {
        if (event.method !== "POST") {
            throw new HttpError("This endpoint requires a POST request", 405);
        }

        if (event.headers.get("Content-Type") !== "application/json") {
            throw new HttpError("Content-type application/json expected", 415);
        }

        const runtimeConfig = useRuntimeConfig(event);
        const { publicKey } = runtimeConfig.public.discord;

        const signature = event.headers.get("X-Signature-Ed25519");
        const timestamp = event.headers.get("X-Signature-Timestamp");

        const body = await readBody(event);

        const isValidRequest = verifyKey(
            body,
            signature!,
            timestamp!,
            publicKey
        );

        if (!isValidRequest) {
            throw new HttpError("Invalid request signature", 415);
        }

        const json = JSON.parse(body);
        console.log(json)

        // Respond to Ping from Discord to verify the endpoint
        if (json.type === 1) {
            return new Response(JSON.stringify({ type: 1 }), {
                headers: { "Content-Type": "application/json" },
            });
        }

        // Handle /faucet command
        if (json.data.name === "faucet") {
            return new Response(JSON.stringify({
                type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
                data: {
                    content: "Please use https://faucet.xion.burnt.com",
                },
            }), {
                headers: { "Content-Type": "application/json" },
            });
        }

        throw new HttpError("Unknown commande", 400);
    } catch (e) {
        console.error(e);
        if (e instanceof HttpError) {
            return new Response(JSON.stringify(e), {
                status: e.status,
                headers: { "Content-Type": "application/json" }
            });
        }
        return new Response(JSON.stringify(new HttpError(`Error: ${e}`, 500)), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
})
