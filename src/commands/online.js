require("dotenv").config();

module.exports = {
    name: "online",
    aliases: ['test', 't'],
    description: "Checks if the bot is online.",
    async execute(client, message) {
        message.reply(client.user.presence.status);
    }
}