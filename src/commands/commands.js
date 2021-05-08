require("dotenv").config();

module.exports = {
    name: "commands",
    aliases: ['cmds'],
    async execute(client, message) {
        const id = message.author.id;
        var STR = "";
        for (const [key, value] of client.commands) {
            STR += `${process.env.PREFIX}${key}\n`
        }
        
        client.users.cache.get(id).send(STR);
    }
}