require("dotenv").config();

const link = "https://cdn.discordapp.com/attachments/586713238016622593/840771655261487134/clown.mp4"

module.exports = {
    name: "clown",
    description: "Clown video",
    async execute(_, message) {
        message.channel.send(link)
    }
}