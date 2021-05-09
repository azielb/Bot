require("dotenv").config();

const videos = {
    clown: "https://cdn.discordapp.com/attachments/586713238016622593/840771655261487134/clown.mp4",
    serious: "https://cdn.discordapp.com/attachments/586713238016622593/840771120278011964/serious.mp4",
    smh: "https://cdn.discordapp.com/attachments/764447332288561152/836960557915308042/video0.mov",
}

module.exports = {
    name: "video",
    aliases: ['v', 'vid'],
    description: "Sends a the specified video (type .v to get a list of all videos)",
    async execute(client, message, discord, args) {
        const video = args.join(" ").toLowerCase();
        const avatar = await client.users.cache.get(client.user.id).avatarURL();
        
        message.channel.send(videos[`${video}`]).catch(() => {
            const embed = new discord.MessageEmbed()
                .setColor('#FF0000')
                .setTitle("Videos")
                .setAuthor(process.env.BOT_NAME, avatar)
                .setTimestamp()

            var vid_names = "";
            
            Object.keys(videos).forEach((vid) => {
                vid_names += `${vid}\n`
            })

            embed.addField(vid_names, '\u200B', true);
            message.channel.send(embed);
        });
    }
}