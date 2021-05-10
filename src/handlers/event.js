const fs = require('fs');

module.exports = (client, discord) => {
    const dir = (dirs) => {
        const files = fs.readdirSync(`./src/events/${dirs}`).filter(file => file.endsWith('.js'));

        for (const file of files) {
            const event = require(`../events/${dirs}/${file}`);
            const event_name = file.split('.')[0];
            client.on(event_name, event.bind(null, discord, client));
        }
    }

    ['client', 'guild'].forEach(d => dir(d));
}