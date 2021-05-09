const Scraper = require('images-scraper');
const max_images = 10000;
const ERROR_MESSAGE = "Failed to retrieve the image.";
const results = new Array();
var ready = false;

new Scraper({
    puppeteer: {
        headless: true
    }
}).scrape('monkey', max_images).then((r) => {
    console.log("Finished scraping for monkey images.");
    ready = true;
    for (result of r) {
        results.push(result);
    }
})

const clamp = function(num, min, max) {
    return Math.min(Math.max(num, min), max)
}

module.exports = {
    name: "monkey",
    aliases: ['m'],
    description: "Sends a random monkey image to a channel",
    async execute(_, message) {
        if (!ready) {
            message.channel.send("Have not finished caching monkey images.");
            return;
        }

        const index = clamp(Math.floor(Math.random() * results.length), 0, results.length - 1);
        message.channel.send(results[index].url).catch(() => {
            message.channel.send(ERROR_MESSAGE);
        })
    }
} 