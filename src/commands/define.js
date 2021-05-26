module.exports = {
    name: "define",
    aliases: ['d'],
    description: "Gets a word's definition",
    async execute(client, message, args) {
        if (!args.length) return message.channel.send('Please enter a word to define!');
        
        args = args.join(' ');
        
        client.fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${args}?key=${process.env.WEBSTER_API_KEY}`).then(async response => {
            const data = await response.json()

            if (!data[0] || !data[0].shortdef) return message.channel.send(`No definitions found for: \`${args}\``)

            var count = 1;

            const embed = new client.discord.MessageEmbed()
                .setColor('#FFFF00')
                .setTitle(`Definitions for: \`${args}\``)
                .setAuthor(process.env.BOT_NAME, client.avatar)
                .setTimestamp()

            data[0].shortdef.forEach((definition) => {
                embed.addField(`${count}`, definition, false);
                count += 1;
            })

            return message.channel.send(embed);
        }).catch(err => {
            console.error(err);
            return message.channel.send(`Something went wrong while getting the definition for ${args}!`);
        })
    }
}