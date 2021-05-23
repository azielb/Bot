module.exports = (client) => {
    console.log(`${client.user.username} [ONLINE]`);
    client.user.setStatus('online');
    client.user.setActivity('DN', {
        type: "WATCHING",
    });
    // client.user.setActivity(`${process.env.PREFIX}commands | ${process.env.PREFIX}help`, {
    //     type: "WATCHING",
    // });
    
    //Sets bot avatar to whatever my avatar is at the time.
    client.users.fetch(process.env.OWNER_ID).then((me) => {
        client.user.setAvatar(me.displayAvatarURL({
            format: "jpg"
        })).catch((err) => {
            console.log("Failed to set avatar: " + err);
        });
    }).catch(() => {
        console.log("FAILED TO FETCH MY OWNER?!");
    })
}