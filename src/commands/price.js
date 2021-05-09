require("dotenv").config();

const CoinMarketCap = require('coinmarketcap-api');
const cmc = new CoinMarketCap(process.env.COIN_MARKET_CAP_API_KEY);

module.exports = {
    name: "price",
    description: "Gets the current sell price of the specified crypto currency",
    aliases: ['p'],
    async execute(client, message, discord, args) {
        if (args.length === 0) {
            message.channel.send("Please enter a currency symbol to query");
            return;
        }

        const avatar = await client.users.cache.get(client.user.id).avatarURL();
        const SYMBOL = args.join(' ').toUpperCase();
        var symbols = new Array(); symbols.push(SYMBOL);
        const info = await cmc.getQuotes({symbol: symbols});

        if (!info || info.status.error_code !== 0)
            message.channel.send(`${SYMBOL} is invalid`)
        else {
            const name = info.data[`${SYMBOL}`].name
            const embed = new discord.MessageEmbed()
                .setColor('#00FF00')
                .setTitle(name)
                .setAuthor(process.env.BOT_NAME, avatar)
                .setDescription('Price: ' + '$' + info.data[`${SYMBOL}`].quote.USD.price + '[USD]')
                .setTimestamp()

            message.channel.send(embed);
        }
    }
}