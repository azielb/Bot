const CoinMarketCap = require('coinmarketcap-api');
const cmc = new CoinMarketCap(process.env.COIN_MARKET_CAP_API_KEY);

module.exports = {
    name: "price",
    description: "Gets the current sell price of the specified crypto currency",
    aliases: ['pr'],
    async execute(client, message, args) {
        if (args.length === 0) {
            message.channel.send("Please enter a currency symbol to query"); return;
        }

        const avatar = await client.users.cache.get(client.user.id).avatarURL();
        const SYMBOL = args.join(' ').toUpperCase();
        var symbols = new Array(); symbols.push(SYMBOL);

        cmc.getGlobal(`${SYMBOL}`).then((info) => {
            cmc.getQuotes({symbol: symbols}).then((quote_data) => {
                const name = quote_data.data[`${SYMBOL}`].name;
                const dominance = `Bitcoin dominance: ${client.round(info.data.btc_dominance, 3)}%\nEthereum dominance: ${client.round(info.data.eth_dominance, 3)}%`;
                const embed = new client.discord.MessageEmbed()
                    .setColor('#00FF00')
                    .setTitle(name)
                    .addField(dominance, '\u200B', true)
                    .setAuthor(process.env.BOT_NAME, avatar)
                    .setDescription('Price: ' + '$' + quote_data.data[`${SYMBOL}`].quote.USD.price + ' [USD]')
                    .setTimestamp()
    
                message.channel.send(embed);
            }).catch(() => {
                message.channel.send(`Something went wrong getting ${SYMBOL}'s quote data`);
            })
        }).catch(() => {
            message.channel.send(`${SYMBOL} is invalid`);
        })
    }
}