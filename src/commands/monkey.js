const Scraper = require('images-scraper');
const max_images = 10000;
const ERROR_MESSAGE = "Failed to retrieve the image.";
const SCRAPE_ERROR_MESSAGE = "ERROR: ";
var results = new Array();
var ready = false;

new Scraper({
    puppeteer: {
        headless: true
    }
}).scrape('monkey', max_images).then((r) => {
    for (result of r) {
        try {
            results.push(result);
        } catch (e) {
            console.log(`${SCRAPE_ERROR_MESSAGE} ${e}`);
        }
    }
    ready = true;
    console.log("Finished caching monkey images.");
}).catch((e) => {
    console.log(`${SCRAPE_ERROR_MESSAGE} ${e}`);
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
            message.channel.send('Still caching monkey images.');
            return;
        }
        const index = clamp(Math.floor(Math.random() * results.length), 0, results.length - 1);
        message.channel.send(results[index].url).catch(() => {
            message.channel.send(ERROR_MESSAGE);
        })
    }
} 