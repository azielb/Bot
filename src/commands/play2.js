module.exports = {
    name: 'play2',
    aliases: [],
    cooldown: 0,
    description: 'Music bot functionalities',
    async execute(client, message, args, cmd) {
        const query = args.join(" ");
        console.log(query)
        client.distube.play(message, query)

    }
}