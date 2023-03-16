const { SlashCommandBuilder } = require('discord.js');
//const { openai } = require('config.json'); // load API key from config file
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gpt')
    .setDescription('Ask ChatGPT anything')
    .addStringOption(option => option.setName('input').setDescription('The input to process')),
  async execute(interaction) {
    const input = interaction.options.getString('input');
    try {
      const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
        prompt: input,
        max_tokens: 4000,
        n: 1,
        stop: '\n',
        temperature: 0.7
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': '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'
        }
      });
      const message = response.data.choices[0].text;
      await interaction.reply(message);
    } catch (error) {
      console.log(error);
      await interaction.reply('Something went wrong');
    }
  },
};
