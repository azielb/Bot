module.exports = (_, client, __) => {
    console.log(`${client.user.username} [ONLINE]`);
    client.user.setActivity("FUNCTIONAL", {
        type: "STREAMING",
    });
}