require("dotenv").config();
const discord = require('discord.js');
const client = new discord.Client();

client.commands = new discord.Collection();
client.events = new discord.Collection();

['command', 'event'].forEach(handler => {
    require(`./handlers/${handler}`)(client, discord);
})

client.login(process.env.DISCORD_TOKEN);