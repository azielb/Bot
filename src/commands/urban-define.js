module.exports = {
    name: "urban-define",
    aliases: ['ud'],
    description: "Gets a word's definition from urban dictionary",
    async execute(client, message, args) {
        if (!args.length) return message.channel.send('Please enter a word to define!');

        client.fetch(`http://api.urbandictionary.com/v0/define?term=${args[0]}`).then(async response => {
            const data = await response.json()
            var count = 1;

            const embed = new client.discord.MessageEmbed()
                .setColor('#FFFF00')
                .setTitle(`Urban Dictionary Definitions for: \`${args[0]}\``)
                .setAuthor(process.env.BOT_NAME, client.avatar)
                .setTimestamp()

            data.list.forEach((entry) => {
                embed.addField(`${count}:`, entry.definition, false);
                count += 1;
            })

            return message.channel.send(embed);
        }).catch(err => {
            console.error(err);
            return message.channel.send('Something went wrong while getting the definition!');
        })
    }
}