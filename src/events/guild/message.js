/*
    execute(
        client: client object
        message: message object
        discord: discord object
        args: any extra text
    )
*/

const clamp = function(num, min, max) {
    return Math.min(Math.max(num, min), max)
}

const messages = [
    "You dare speak about my master?",
    "What do you want?",
    "https://media.discordapp.net/attachments/565643666828427284/844543541798633522/image0.gif",
    "https://cdn.discordapp.com/attachments/764447332288561152/844615536808558622/image0.gif",
]

module.exports = (discord, client, message) => {
    if (message.author.bot) return
    if (message.content.startsWith(process.env.PREFIX)) {
        const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
        const cmd_Name = args.shift().toLowerCase();
        const command = client.commands.get(cmd_Name) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmd_Name));
    
        if (command) command.execute(client, message, discord, args);
    } else if (message.content.toLowerCase().includes(process.env.OWNER_NAME)) {

        if (message.author.id === process.env.OWNER_ID) {
            message.reply("Hello master")
            return
        }

        const index = clamp(Math.floor(Math.random() * messages.length), 0, messages.length - 1);
        message.reply(messages[index]);
    }
}