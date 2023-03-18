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
                .addIntegerOption(option =>
                    option.setName('month')
                        .setDescription('Enter your month')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('day')
                        .setDescription('Enter your birthday in the format MM/DD')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('year')
                        .setDescription('Enter your birthday in the format'))),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'get') {
            const user = interaction.options.getUser('user');
            const birthdays = JSON.parse(fs.readFileSync('./birthdays.json', 'utf8'));
            if (birthdays[user.id]) {
                const birthday = birthdays[user.id];
                let dateMessage;
                if (birthday.year) {
                    dateMessage = `${user.username}'s birthday is ${birthday.month}/${birthday.day}/${birthday.year}.`;
                } else {
                    dateMessage = `${user.username}'s birthday is ${birthday.month}/${birthday.day}.`;
                }
                await interaction.reply(dateMessage);
            } else {
                await interaction.reply(`Sorry, I couldn't find ${user.username}'s birthday.`);
            }
        } else if (interaction.options.getSubcommand() === 'set-birthday') {
            const Day = interaction.options.getInteger('day');
            const Month = interaction.options.getInteger('month');
            const Year = interaction.options.getInteger('year')

            if (Year == null) {
                 givenYear = false
            } else {
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
            birthdays[userId] = {
                month: Month,
                day: Day,
                year: givenYear ? Year : null
            }
            
            // Save updated birthdays to file
            try {
                fs.writeFileSync('./birthdays.json', JSON.stringify(birthdays));
                let dateMessage;
                if (givenYear) {
                    dateMessage = `Your birthday has been recorded as ${Month}/${Day}/${Year}.`;
                } else {
                    dateMessage = `Your birthday has been recorded as ${Month}/${Day}.`;
                }
                
                await interaction.reply(dateMessage);
            } catch (err) {
                console.error(err);
                await interaction.reply(`There was an error recording your birthday.`);
            }
        }
    },
};