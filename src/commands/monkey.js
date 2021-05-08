var Scraper = require('images-scraper');

const google = new Scraper({
    puppeteer: {
        headless: true
    }
})

module.exports = {
    name: "monkey",
    description: "Sends a random monkey image to a channel",
    async execute(_, message) {
        const results = await google.scrape('monkey', 1000);
        message.channel.send(results[Math.floor(Math.random() * results.length)].url);
    }
} 