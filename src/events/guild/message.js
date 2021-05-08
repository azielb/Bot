require("dotenv").config();

module.exports = (discord, client, message) => {

    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return

    const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
    const cmd_Name = args.shift().toLowerCase();
    const command = client.commands.get(cmd_Name) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmd_Name));

    if (command) command.execute(client, message, discord, args);
}