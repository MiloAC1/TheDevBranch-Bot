const { SlashCommandBuilder } = require('@discordjs/builders');
const ytdl = require('ytdl-core');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('youtube')
        .setDescription('Plays a YouTube video in the voice channel')
        .addStringOption(option => option.setName('url').setDescription('The URL of the YouTube video to play').setRequired(true)),
    async execute(interaction) {
        const url = interaction.options.getString('url');
        const voiceChannel = interaction.member.voice.channel;
        
        if (!voiceChannel) {
            return interaction.reply('You need to be in a voice channel to use this command!');
        }
        
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
        
        const stream = ytdl(url, { filter: 'audioonly' });
        const resource = createAudioResource(stream);
        const player = createAudioPlayer();
        
        player.play(resource);
        
        connection.subscribe(player);
        
        await interaction.reply(`Playing ${url} in :sound:${voiceChannel.name}`);
    },
};