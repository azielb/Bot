module.exports = (client) => {
    console.log(`${client.user.username} [ONLINE]`);
    client.user.setStatus('online');
    client.user.setActivity('DN', {
        type: "WATCHING",
    });

    //Sets bot avatar to whatever my avatar is at the time.
    client.users.fetch(process.env.OWNER_ID).then((me) => {
        client.user.setAvatar(me.displayAvatarURL({
            format: "jpg"
        })).then(async user => {
            client.avatar = user.avatar;
        }).catch(async () => {
            client.avatar = await client.users.cache.get(client.user.id).avatarURL();
        });
    }).catch(() => {
        console.log("FAILED TO FETCH MY OWNER?!");
    })
}