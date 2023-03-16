const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('birthday')
        .setDescription('Record your birthday.')
        .addStringOption(option =>
            option.setName('month')
                .setDescription('Enter your month')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('day')
                .setDescription('Enter your birthday in the format MM/DD')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('year')
                .setDescription('Enter your birthday in the format')),
    async execute(interaction) {
        const Day = interaction.options.getString('day');
        const Month = interaction.options.getString('month');
        const Year = interaction.options.getString('year');
        const date = Month + '-' + Day + '-' + Year
        const userId = interaction.user.id;
        
        // Load existing birthdays from file
        let birthdays;
        try {
            const data = fs.readFileSync('./birthdays.json', 'utf8');
            birthdays = JSON.parse(data);
        } catch (err) {
            console.error(err);
            birthdays = {};
        }
        
        // Add or update user's birthday
        birthdays[userId] = date;
        
        // Save updated birthdays to file
        try {
            fs.writeFileSync('./birthdays.json', JSON.stringify(birthdays));
            await interaction.reply(`Your birthday has been recorded as ${date}.`);
            const dateString = date;
            const [monthString, dayString, yearString] = dateString.split("/");
            const month = parseInt(monthString);
            const day = parseInt(dayString);
            const year = parseInt(yearString);
        } catch (err) {
            console.error(err);
            await interaction.reply(`There was an error recording your birthday.`);
        }
    },
};