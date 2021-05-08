module.exports = (discord, client, message) => {
    const prefix = '.'

    if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).split(/+/)
    const cmd_Name = args.shift().toLowerCase()
    const command = client.commands.get(cmd_Name)

    if (command) command.execute(client, message, args, discord)
}