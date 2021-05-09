const Scraper = require('images-scraper');
const max_images = 1000;
const ERROR_MESSAGE = "Failed to retrieve the image.";
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
            if (!typeof(results[index].url) === "string") {
                message.channel.send(ERROR_MESSAGE);
            } else {
                message.channel.send(results[index].url);
            }
        }).catch(() => {
            message.channel.send(ERROR_MESSAGE);
        })
    }
} 