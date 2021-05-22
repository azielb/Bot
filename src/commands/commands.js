module.exports = {
    name: "commands",
    description: "Lists every command",
    aliases: ['cmds', 'cmd', 'help'],
    async execute(client, message) {
        const id = message.author.id;
        const avatar = await client.users.cache.get(client.user.id).avatarURL();
        const embed = new client.discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Commands')
            .setAuthor(process.env.BOT_NAME, avatar)
            .setDescription(`Prefix: ${process.env.PREFIX}`)
            .setTimestamp()

        for (const [cmd_Name, cmd] of client.commands) {
            if (cmd.aliases) {
                var aliases = "";
                for (const alias of cmd.aliases) {
                    aliases += `${alias}, `;
                }      
                embed.addField(`${cmd_Name}`, `Description: ${cmd.description}\nAliases: ${aliases}`, false);
            } else {
                embed.addField(`${cmd_Name}`, `Description: ${cmd.description}`, false);
            }
        }

        client.users.cache.get(id).send(embed);
    }
}