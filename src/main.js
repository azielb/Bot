require("dotenv").config();
const discord = require('discord.js');
const DisTube = require("distube");
const client = new discord.Client();

client.discord = discord
client.distube = new DisTube(client, {searchSongs: false, emitNewSongOnly: true});
client.commands = new discord.Collection();
client.events = new discord.Collection();

['command', 'event'].forEach(handler => {
    require(`./handlers/${handler}`)(client);
})

client.login(process.env.DISCORD_TOKEN);