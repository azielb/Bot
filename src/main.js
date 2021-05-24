require("dotenv").config();
const discord = require('discord.js');
const DisTube = require("distube");
const fetch = require('node-fetch')
const client = new discord.Client();

client.fetch = fetch
client.discord = discord
client.distube = new DisTube(client, {searchSongs: false, emitNewSongOnly: true});
client.commands = new discord.Collection();
client.events = new discord.Collection();
client.clamp = (num, min, max) => {
    return Math.min(Math.max(num, min), max)
}
client.round = (num, places) => {
    places = typeof(places) == "number" ? places : 2;
    return +(Math.round(num + `e+${places}`)  + `e-${places}`);
}

['command', 'event'].forEach(handler => {
    require(`./handlers/${handler}`)(client);
})

client.login(process.env.DISCORD_TOKEN);