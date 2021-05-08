const link = "https://www.roblox.com/games/5202297512/Boba-Simulator"

module.exports = {
    name: "boba",
    description: "Sends the link to the Boba Simulator game",
    async execute(_, message) {
        message.channel.send(`Boba Simulator: ${link}`);
    }
} 