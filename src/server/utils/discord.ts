import type { DiscordUserData } from "nuxt/schema";

// Register Discord slash commands with the Discord API
async function registerDiscordCommands() {
    const runtimeConfig = useRuntimeConfig();
    const { token, appId, guildId } = runtimeConfig.discord;

    const cmd = {
        name: "faucet",
        description: "Sends funds to a given wallet address",
        options: [
            {
                type: 3, // STRING
                name: "address",
                description: "Destination wallet address",
                required: true,
            },
        ],
    };

    console.log(`Creating Discord command: ${cmd.name}`);

    try {
        const response = await fetch(
            `https://discord.com/api/v10/applications/${appId}/guilds/${guildId}/commands`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bot ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cmd),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Couldn't create command (${response.status}): ${errorText}`);
        }

        const discordCmd = await response.json();
        console.log(`Discord command registered: ${discordCmd}`);

        return [discordCmd]; // Array of registered commands
    } catch (err) {
        console.error(`Error creating Discord command: ${err}`);
        throw err;
    }
}

// Register handlers for Discord interactions
// function registerDiscordHandlers() {
//     const commandHandlers = {
//         "faucet": handleFaucetCommand,
//     };

//     const componentHandlers = {
//         "fd_no": handleButtonNo,
//         "fd_yes": handleButtonYes,
//     };

//     console.log("Discord handlers registered");
//     return { commandHandlers, componentHandlers };
// }

// Check Discord bot status
async function verifyDiscordBot() {
    const runtimeConfig = useRuntimeConfig();
    const { token } = runtimeConfig.discord;

    try {
        const response = await fetch(
            'https://discord.com/api/v10/users/@me',
            {
                headers: {
                    'Authorization': `Bot ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Couldn't connect to Discord: ${response.statusText}`);
        }

        const userData = await response.json() as DiscordUserData;
        const username = userData.discriminator
            ? `${userData.username}#${userData.discriminator}`
            : userData.username;

        console.log(`Discord bot is up! Username: ${username}`);
        return userData;
    } catch (err) {
        console.error(`Discord bot verification failed: ${err}`);
        throw err;
    }
}
