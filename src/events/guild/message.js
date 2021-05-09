require("dotenv").config();

/*
    execute(
        client: client object
        message: message object
        discord: discord object
        args: any extra text
    )
*/

module.exports = (discord, client, message) => {
    if (message.author.bot) return
    if (message.content.startsWith(process.env.PREFIX)) {
        const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
        const cmd_Name = args.shift().toLowerCase();
        const command = client.commands.get(cmd_Name) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmd_Name));
    
        if (command) command.execute(client, message, discord, args);
    } else if (message.content.toLowerCase().includes(process.env.OWNER_NAME)) {
        message.reply("You dare speak about my master?");
    }
}