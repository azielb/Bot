const ytdl = require('ytdl-core')
const ytSearch = require('yt-search')
const queue = new Map();
const ERROR_MESSAGES = {
    NOT_IN_VOICE_CHANNEL: 'You must be in a voice channel to execute this command.',
    INCORRECT_PERMISSIONS: 'You do not have permission to execute this command.',
    NO_VIDEOS_IN_QUEUE: 'There are no videos in the queue.',
    ERROR_EXECUTING_COMMAND: '❌ Something went wrong executing this command.',
    ERROR_FINDING_VIDEO: '❌ Error finding video.',
    ERROR_CONNECTING_TO_VOICE_CHANNEL: '❌ Error connecting to the voice channel.',
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

        client.on('voiceStateUpdate', (oldState, newState) => {
            if (oldState.channelID !== oldState.guild.me.voice.channelID || newState.channel)
                return;

            if ((!oldState.channel.members.size - 1) || !queue.get(message.guild.id))
                setTimeout(() => {
                    if ((!oldState.channel.members.size - 1) || !queue.get(message.guild.id))
                        oldState.channel.leave();
                }, 1000 * 60 * 2);
        })

        try {
            if (cmd === 'play' || cmd === 'p') play(message, entry, args, voiceChannel)
            else if (cmd === 'skip' || cmd === 'sk') skipVideo(message, entry)
            else if (cmd === 'stop' || cmd === 'st') stopVideo(message, entry)
            else if (cmd === 'queue' || cmd === 'q') getQueue(message, entry, client)
            else if (cmd === 'current' || cmd === 'c') getCurrent(message, entry, client)
        } catch (error) {
            message.channel.send(ERROR_MESSAGES.ERROR_EXECUTING_COMMAND);
            console.error(error);
        }
    }
}

const getCurrent = async (message, serverQueue, client) => {
    if (!message.member.voice.channel) return message.channel.send(ERROR_MESSAGES.NOT_IN_VOICE_CHANNEL);
    if (!serverQueue) return message.channel.send(ERROR_MESSAGES.NO_VIDEOS_IN_QUEUE);

    var str = `\`${serverQueue.videos[0].title} (${serverQueue.videos[0].duration})\`\n`

    const embed = new client.discord.MessageEmbed()
        .setColor('#FF0000')
        .setTitle('Currently playing:')
        .setTimestamp()
        .addField(str, '\u200B', true)

    return message.channel.send(embed)
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
    
    var str = ""
    var count = 1

    serverQueue.videos.forEach((video) => {
        str += `${count}. \`${video.title} (${video.duration})\`\n`
        count += 1
    })

    const embed = new client.discord.MessageEmbed()
        .setColor('#FF0000')
        .setTitle('Queue')
        .setTimestamp()
        .addField(str, '\u200B', true)

    return message.channel.send(embed)
}

const videoFinder = async (query) => {
    const videoResult = await ytSearch(query)
    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
}

const convertToMinutesAndSeconds = async (time) => {
    time = parseInt(time)
    const minutes = Math.floor(time / 60)
    const seconds = (time % 60)
    if (seconds < 10) {
        return `${minutes}:0${seconds}`
    }
    return `${minutes}:${seconds}`
}

const playVideo = async (guild, video) => {
    const entry = queue.get(guild.id);

    if (!video) {
        return queue.delete(guild.id);
    }

    const stream = ytdl(video.url, { filter: 'audioonly' });
    entry.connection.play(stream, { seek: 0, volume: 0.5 }).on('finish', () => {
        entry.videos.shift();
        playVideo(guild, entry.videos[0])
    })
    await entry.textChannel.send(`🎵🎵 Now playing: \`${video.title}\``)
}

const play = async (message, entry, args, voiceChannel) => {
    if (!args.length) return message.channel.send('Invalid arguments')
    let vid = {}

    if (ytdl.validateURL(args[0])) {
        const vidInfo = await ytdl.getInfo(args[0])
        const time = await convertToMinutesAndSeconds(vidInfo.videoDetails.lengthSeconds)
        vid = {
            title: vidInfo.videoDetails.title,
            url: args[0],
            duration: time
        }
    } else {
        const video = await videoFinder(args.join(' '));
        if (video) {
            vid = {
                title: video.title,
                url: video.url,
                duration: video.timestamp
            }
        } else {
            message.channel.send(ERROR_MESSAGES.ERROR_FINDING_VIDEO)
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
            message.channel.send(ERROR_MESSAGES.ERROR_CONNECTING_TO_VOICE_CHANNEL)
        }

    } else {
        entry.videos.push(vid);
        return message.channel.send(`**\`${vid.title}\`** was added to the queue`)
    }
}