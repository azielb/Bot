module.exports = {
    name: "fact",
    aliases: ['f'],
    description: "Sends a random useless fact",
    async execute(client, message) {
        client.fetch('https://uselessfacts.jsph.pl/random.json?language=en').then(async response => {
            const data = await response.json()
            message.channel.send(data.text)
        }).catch(err => {
            console.error(err);
            return message.channel.send('Something went wrong while getting the fact!');
        })
    }
}