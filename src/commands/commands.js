require("dotenv").config();

module.exports = {
    name: "commands",
    description: "Lists every command",
    aliases: ['cmds'],
    async execute(client, message, discord) {
        const id = message.author.id;
        const avatar = await client.users.cache.get(client.user.id).avatarURL();
        const embed = new discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Commands')
            .setAuthor('ZickBot', avatar)
            .setDescription(`Prefix: '${process.env.PREFIX}'`)
            .setTimestamp()

        for (const [cmd_Name, cmd] of client.commands) {
            embed.addField(`${cmd_Name}`, cmd.description, false);
        }

        client.users.cache.get(id).send(embed);
    }
}