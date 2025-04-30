#!/bin/bash

# Set these variables with your app's info
APPLICATION_ID="1353804675127971944" # xion-faucet
GUILD_ID="823953904512401469" 
GUILD_ID="1354903960535957534" 
BOT_TOKEN="${BOT_TOKEN}"

# Discord API endpoint
DISCORD_API="https://discord.com/api/v10"

# Slash command JSON payload
read -r -d '' COMMAND_PAYLOAD << EOM
{
  "name": "faucet",
  "description": "Request testnet tokens",
  "type": 1,
  "options": [
    {
      "type": 3,
      "name": "address",
      "description": "Your wallet address",
      "required": true
    }
  ]
}
EOM

# Register command (guild-specific, faster to propagate)
curl -X POST "$DISCORD_API/applications/$APPLICATION_ID/guilds/$GUILD_ID/commands" \
  -H "Authorization: Bot $BOT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$COMMAND_PAYLOAD"
