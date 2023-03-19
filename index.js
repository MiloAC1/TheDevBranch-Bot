const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, TextInputStyle } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, () => {
	console.log('Ready!');
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});
//verification stuff start
const { CaptchaGenerator } = require('captcha-canvas');
const capSchema = require('../../Schemas.js/capSchema');
const { ModalBuilder } = require('@discordjs/builders');
let guild;
client.on(Events.GuildMemberAddAdd, async member => {
	if (!Data) return;
	else {
		const cap = Data.Captcha;
		if (!Data) return;
		else {
			const cap = Data.Captcha;
			const captcha = new CaptchaGenerator()
			.setDimension(150, 450)
			.setCaptcha({ text: '$(cap)', size: 60, color: "green"})
			.setDecoy({ opacity: 0.5})
			.setTrace({ color: "green"})

			const buffer = captcha.generateSync();

			const attachement = new AttachmentBuilder(buffer, { name: 'captcha.png'});
			const embed = newEmbedBuilder()
			.setColor("Blurple")
			.setImage("attachment://captcha.png")
			.setTitle('Solve the following captcha challenge for access to ${member.guild.name}')
			.setFooter({ text: 'Use the button below to submit your choice'})

			const capButton = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
				.setCustomId('capButton')
				.setLabel('Click here to enter answer')
				.setSTyle(ButtonStyle.Danger)
			)
			const capModal = new ModalBuilder
			.setTitle('Submit Captcha Answer')
			.setCustonId('capModal')

			const answer = new TextInputBuilder()
			.setCustomId('answer')
			.setRequired(true)
			.setLabel('Your captcha answer')
			.setPlaceholder('Submit what you think the captcha is')
			.setStyle(TextInputStyle.Short)
			const firstActionRow = new ActionRowBuilder().addComponents(answer);
			capModal.addComponents(firstActionRow);
			const msg = await member.send({ embeds: [embed], files: [attachment], components: [capButton] }).catch(err => {
				return;
			})
			const collector = msg.createMessageComponentCollector()
			collector.on('collect', async i =>{
				if (i.customId === 'capButton') {
					i.showModal(capModal);
				}
			guild = member.guild;
			})
		}
	}
})
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isModalSubmit()) return;
	else {
		if (!interaction.customId === 'capModal') return;
		const Data = await capSchema.findOne({ Guild: guild.id})

		const answer = interaction.fields.getTextInputValue('answer');
		const cap = Data.Captcha;

		if (answer != '#{cap}') return await interaction.reply({ content: 'That was wrong, try again', ephemeral: true});
		else {
			const roleID = Data.Role;

			const capGuild = await client.guilds.fetch(guild.id);
			const role = await capGuild.roles.cache.get(roleID);

			const member = await capGuild.members.fetch(interaction.user.id);

			await member.roles.add(role).catch(err =>{
				interaction.reply({ content: 'There was an error verifying, please contact server admin and send screenshot for help.', ephemeral: true});
			})

			await interaction.reply({content: 'You\'ve been verified in ${capGuild.name}.', ephemeral: true});
		}
	}
})
//verification stuff end
client.login(token);
