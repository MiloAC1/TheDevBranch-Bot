const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('birthday')
        .setDescription('Record your birthday.')
        .addStringOption(option =>
            option.setName('date')
                .setDescription('Enter your birthday in the format MM/DD')
                .setRequired(true)),
    async execute(interaction) {
        const date = interaction.options.getString('date');
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
        } catch (err) {
            console.error(err);
            await interaction.reply(`There was an error recording your birthday.`);
        }
    },
};