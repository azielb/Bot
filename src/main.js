require("dotenv").config()
const {Client} = require('discord.js')
const client = new Client()

client.once('ready', () => {
    console.log(`${client.user.username} [ONLINE]`)
})

client.on('message', (message) => {
    if (message.author.bot) return
})

client.login(process.env.TOKEN)