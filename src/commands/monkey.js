var Scraper = require('images-scraper');

const google = new Scraper({
    puppeteer: {
        headless: true
    }
})

const clamp = function(num, min, max) {
    return Math.min(Math.max(num, min), max)
}

module.exports = {
    name: "monkey",
    description: "Sends a random monkey image to a channel",
    async execute(_, message) {
        const results = await google.scrape('monkey', 1000);
        const index = clamp(Math.floor(Math.random() * results.length), 0, results.length - 1);
        message.channel.send(results[index].url);
    }
} 