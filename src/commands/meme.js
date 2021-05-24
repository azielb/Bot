const fetch = require('node-fetch')

module.exports = {
    name: "meme",
    aliases: ['me'],
    description: "Sends a random meme",
    async execute(client, message) {
        fetch('https://some-random-api.ml/meme').then(async response => {
            const data = await response.json()
            message.channel.send(data.image)
        }).catch(err => {
            console.error(err);
            return message.channel.send('Something went wrong while getting the meme!');
        })
    }
}