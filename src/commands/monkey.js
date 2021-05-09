const Scraper = require('images-scraper');
const max_images = 1000;
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
        google.scrape('monkey', max_images).then((results) => {
            const index = clamp(Math.floor(Math.random() * results.length), 0, results.length - 1);
            message.channel.send(results[index].url);
        }).catch(() => {
            message.channel.send("Failed to retrieve the image.")
        })
    }
} 