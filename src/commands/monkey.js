var Scraper = require('images-scraper');

const google = new Scraper({
    puppeteer: {
        headless: true
    }
})

module.exports = {
    name: "monkey",
    async execute(client, message) {
        const results = await google.scrape('monkey', 1000);
        message.channel.send(results[Math.floor(Math.random() * results.length)].url);
    }
} 