const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('birthday')
        .setDescription('Record your birthday.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('get')
                .setDescription('Get user birthday')
                .addUserOption(option => 
                    option.setName('user')
                        .setDescription('Select a user')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('set-birthday')
                .setDescription('Set your')
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
                        .setDescription('Enter your birthday in the format'))),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'get') {
            const user = interaction.options.getUser('user');
            const birthdays = JSON.parse(fs.readFileSync('./birthdays.json', 'utf8'));
            if (birthdays[user.id]) {
                await interaction.reply(`${user.username}'s birthday is ${birthdays[user.id]}`);
            } else {
                await interaction.reply(`Sorry, I couldn't find ${user.username}'s birthday.`);
            }
        } else if (interaction.options.getSubcommand() === 'set-birthday') {
            const Day = interaction.options.getString('day');
            const Month = interaction.options.getString('month');
            const Year = interaction.options.getString('year')

            if (Year == null) {
                 date = Month + '-' + Day 
                 givenYear = false
            } else {
                 date = Month + '-' + Day + '-' + Year
                 givenYear = true
            }

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
        }
    },
};