module.exports = {
    name: "status",
    aliases: ['test', 't'],
    description: "Returns the bot's status",
    async execute(client, message) {
        message.reply(client.user.presence.status);
    }
}