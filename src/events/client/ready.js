require("dotenv").config();

module.exports = (_, client) => {
    console.log(`${client.user.username} [ONLINE]`);
    client.user.setActivity(`${process.env.PREFIX}commands | ${process.env.PREFIX}help`, {
        type: "WATCHING",
    });
}