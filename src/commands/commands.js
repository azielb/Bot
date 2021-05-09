require("dotenv").config();

module.exports = {
    name: "commands",
    description: "Lists every command",
    aliases: ['cmds', 'help'],
    async execute(client, message, discord) {
        const id = message.author.id;
        const avatar = await client.users.cache.get(client.user.id).avatarURL();
        const embed = new discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Commands')
            .setAuthor(process.env.BOT_NAME, avatar)
            .setDescription(`Prefix: '${process.env.PREFIX}'`)
            .setTimestamp()

        for (const [cmd_Name, cmd] of client.commands) {
            var aliases = "";
            
            if (cmd.aliases) { 
                for (const alias of cmd.aliases)
                    aliases += `'${alias}', `;
            }
          
            embed.addField(`${cmd_Name}`, `Description: ${cmd.description}\nAliases: ${aliases}`, false);
        }

        client.users.cache.get(id).send(embed);
    }
}