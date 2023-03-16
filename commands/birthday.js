const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

const command = new SlashCommandBuilder()
    .setName('birthday')
    .setDescription('Manage your birthday')
    .addSubcommand(subcommand =>
        subcommand
            .setName('set')
            .setDescription('Set your birthday')
            .addIntegerOption(option => option.setName('day').setDescription('Day of the month').setRequired(true))
            .addIntegerOption(option => option.setName('month').setDescription('Month of the year').setRequired(true))
            .addIntegerOption(option => option.setName('year').setDescription('Year of birth').setRequired(true)));

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'birthday') {
        if (interaction.options.getSubcommand() === 'set') {
            const day = interaction.options.getInteger('day');
            const month = interaction.options.getInteger('month');
            const year = interaction.options.getInteger('year');

            // Save birthday to JSON file
            const data = { day, month, year };
            fs.writeFileSync('./birthdays.json', JSON.stringify(data));

            await interaction.reply(`Your birthday has been set to ${day}/${month}/${year}!`);
        }
    }
});

client.login(token);