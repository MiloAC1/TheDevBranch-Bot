const { Client, Intents } = require('discord.js');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS],
});

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const guildId = '1078350464975908925'; // Replace with your guild ID
  const guild = client.guilds.cache.get(guildId);

  try {
    const commands = await guild.commands.fetch();
    commands.forEach(command => command.delete());
    console.log('All commands deleted');
  } catch (error) {
    console.error(error);
  }
});

client.login('1078349027139137628'); // Replace with your bot token