const fs = require('fs');

module.exports = (client) => {
    const files = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

    for (const file of files) {
        const command = require(`../commands/${file}`);
        if (command.name) {
            client.commands.set(command.name, command);
        }
    }
}