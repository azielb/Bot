require("dotenv").config();

const link = "https://cdn.discordapp.com/attachments/586713238016622593/840771120278011964/serious.mp4"

module.exports = {
    name: "serious",
    description: "Seriously?",
    async execute(_, message) {
        message.channel.send(link);
    }
}