const sim1 = "https://www.roblox.com/games/5202297512/Boba-Simulator"

module.exports = {
    name: "boba",
    async execute(client, message) {
        message.channel.send(`Boba Simulator: ${sim1}`);
    }
} 