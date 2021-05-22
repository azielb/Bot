const ytdl = require('ytdl-core')
const ytSearch = require('yt-search')
const ERROR_MESSAGES = {
    NOT_IN_VOICE_CHANNEL: 'You must be in a voice channel to execute this command.',
    INCORRECT_PERMISSIONS: 'You do not have permission to execute this command.',
    NO_VIDEOS_IN_QUEUE: 'There are no videos in the queue.',
    ERROR_EXECUTING_COMMAND: 'Something went wrong executing this command.'
}
const queue = new Map();

const playVideo = async (guild, video) => {
    const entry = queue.get(guild.id);

    if (!video) {
        entry.voiceChannel.leave();
        queue.delete(guild.id);
    }

    const stream = ytdl(video.url, {filter: 'audioonly'});
    entry.connection.play(stream, {seek: 0, volume: 0.5}).on('finish', () => {
        entry.videos.shift();
        playVideo(guild, entry.videos[0])
    })
    await entry.textChannel.send(`Now playing: ${video.title}`)
}

const skipVideo = async (message, serverQueue) => {
    if (!message.member.voice.channel) return message.channel.send(ERROR_MESSAGES.NOT_IN_VOICE_CHANNEL);
    if (!serverQueue) return message.channel.send(ERROR_MESSAGES.NO_VIDEOS_IN_QUEUE);
    serverQueue.connection.dispatcher.end();
}

const stopVideo = async (message, serverQueue) => {
    if (!message.member.voice.channel) return message.channel.send(ERROR_MESSAGES.NOT_IN_VOICE_CHANNEL);
    if (!serverQueue) return message.channel.send(ERROR_MESSAGES.NO_VIDEOS_IN_QUEUE);
    serverQueue.videos = []
    serverQueue.connection.dispatcher.end();
}

const getQueue = async (message, serverQueue, client) => {
    if (!message.member.voice.channel) return message.channel.send(ERROR_MESSAGES.NOT_IN_VOICE_CHANNEL);
    if (!serverQueue) return message.channel.send(ERROR_MESSAGES.NO_VIDEOS_IN_QUEUE);
    
    const avatar = await client.users.cache.get(client.user.id).avatarURL();
    var str = ""
    var count = 1

    serverQueue.videos.forEach((video) => {
        str += `${count}. ${video.title}\n`
        count += 1
    })

    const embed = new client.discord.MessageEmbed()
        .setColor('#FF0000')
        .setTitle('Queue')
        .setAuthor(process.env.BOT_NAME, avatar)
        .setTimestamp()
        .addField(str, '\u200B', true)

    return message.channel.send(embed)
}

const play = async(message, entry, args, voiceChannel) => {
    if (!args.length) return message.channel.send('Invalid arguments')
    let vid = {}

    if (ytdl.validateURL(args[0])) {
        const vidInfo = await ytdl.getInfo(args[0]);
        vid = { title: vidInfo.videoDetails.title, url: vidInfo.videoDetails.video_url }
    } else {
        const videoFinder = async (query) => {
            const videoResult = await ytSearch(query)
            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
        }
        const video = await videoFinder(args.join(' '));
        if (video) {
            vid = { title: video.title, url: video.url }
        } else {
            message.channel.send('Error finding video.')
        }
    }

    if (!entry) {
        const entry = {
            voiceChannel: voiceChannel,
            textChannel: message.channel,
            connection: null,
            videos: []
        }

        queue.set(message.guild.id, entry);
        entry.videos.push(vid);

        try {
            const connection = await voiceChannel.join();
            entry.connection = connection;
            playVideo(message.guild, entry.videos[0]);
        } catch (err) {
            queue.delete(message.guild.id);
            message.channel.send('Error connecting to the voice channel.')
        }

    } else {
        entry.videos.push(vid);
        return message.channel.send(`**${vid.title}** was added to the queue`)
    }
}

module.exports = {
    name: 'play',
    aliases: ['p', 'skip', 'sk', 'stop', 'st', 'queue', 'q', 'current', 'c'],
    description: 'Music bot functionalities',
    async execute(client, message, args, cmd) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send(ERROR_MESSAGES.NOT_IN_VOICE_CHANNEL);
        
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send(ERROR_MESSAGES.INCORRECT_PERMISSIONS);
        if (!permissions.has('SPEAK')) return message.channel.send(ERROR_MESSAGES.INCORRECT_PERMISSIONS);

        const entry = queue.get(message.guild.id);

        try {
            if (cmd === 'play' || cmd === 'p') play(message, entry, args, voiceChannel)
            else if (cmd === 'skip' || cmd === 'sk') skipVideo(message, entry)
            else if (cmd === 'stop' || cmd === 'st') stopVideo(message, entry)
            else if (cmd === 'queue' || cmd === 'q') getQueue(message, entry, client)
        } catch (error) {
            message.channel.send(ERROR_MESSAGES.ERROR_EXECUTING_COMMAND);
            console.error(error);
        }
    }
}