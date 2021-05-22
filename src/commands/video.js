const videos = {
    clown: "https://cdn.discordapp.com/attachments/764447332288561152/841022684053635072/Clown.mov",
    serious: "https://cdn.discordapp.com/attachments/586713238016622593/840771120278011964/serious.mp4",
    smh: "https://cdn.discordapp.com/attachments/764447332288561152/836960557915308042/video0.mov",
    drip: "https://cdn.discordapp.com/attachments/586713238016622593/841118230457221150/drip.mp4",
    why: "https://cdn.discordapp.com/attachments/764447332288561152/837080024733450240/video0.mp4",
    pause: "https://cdn.discordapp.com/attachments/579758162937118752/844413037494140938/Media1.mp4",
    cap: "https://cdn.discordapp.com/attachments/586713238016622593/842604996226318386/cap.mp4",
}

module.exports = {
    name: "video",
    aliases: ['v', 'vid'],
    description: "Sends a the specified video (type .v to get a list of all videos)",
    async execute(client, message, args) {
        const video = args.join(" ").toLowerCase();
        const avatar = await client.users.cache.get(client.user.id).avatarURL();

        message.channel.send(videos[`${video}`]).catch(() => {
            const embed = new client.discord.MessageEmbed()
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