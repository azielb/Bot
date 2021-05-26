module.exports = {
    name: "define",
    aliases: ['d'],
    description: "Gets a word's definition",
    async execute(client, message, args) {
        if (!args.length) return message.channel.send('Please enter a word to define!');

        client.fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${args[0]}?key=${process.env.WEBSTER_API_KEY}`).then(async response => {
            const data = await response.json()
            var str = "";
            var count = 1;
            
            data[0].shortdef.forEach((definition) => {
                str += `${count}. ${definition}\n`;
                count += 1;
            })

            const embed = new client.discord.MessageEmbed()
                .setColor('#FFFF00')
                .setTitle("Definitions")
                .setAuthor(process.env.BOT_NAME, client.avatar)
                .addField(str, '\u200B', true)
                .setTimestamp()
                
            return message.channel.send(embed);
        }).catch(err => {
            console.error(err);
            return message.channel.send('Something went wrong while getting the definition!');
        })
    }
}