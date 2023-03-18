const { SlashCommandBuilder } = require('discord.js');
const ytdl = require('ytdl-core');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('youtube')
        .setDescription('Plays a youtube video in a voice channel')
        .setUsage('<youtube url>'),
        async execute(interaction) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply('You must be in a voice channel to use this command');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) return message.reply('I need the permissions to join and speak in your voice channel');
        const connection = await voiceChannel.join();
        const dispatcher = connection.play(ytdl(args[0], { filter: 'audioonly' }));
        dispatcher.on('finish', () => voiceChannel.leave());
        }
}
