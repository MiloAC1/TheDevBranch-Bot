const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const capSchema = require('../../Schemas.js/capSchema')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('captcha')
    .setDescription('Set up captcha verification')
    .addSubcommand(command => command.setName('setup').setDescription('Set up captcha verification system').addRoleOption(option => option.setName('role').setDescription('The role that will be given upon verification').setRequired(true)).addStringOption(option => option.setName('captcha').setDescription('The captcha text that will be in the image').setRequired(true)))
    .addSubcommand(command => command.setName('disable').setDescription('Disable captcha system')),
    async execute (interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You don\'t have permissions to setup/disable this sytem'})

        const Data = await capSchema.findOne({ Guild: interaction.guild.id });

        const { options } = interaction;
        const sub = options.getSubcommand();

        switch (sub) {
            case 'setup':
                if (Data) return await interaction.reply({ content: 'The captcha system is already enabled here', ephemeral: true});
                else {
                    const role = options.getRole('role');
                    const captcha = options .getString('captcha');
                    await capSchema.create({
                        Guild: interaction.guild.id,
                        Role: role.id,
                        Captcha: captcha,
                    })

                    const embed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setDescription(':thumbsup: The captcha system has been set up successfully')

                    await interaction.reply({ embeds: [embed] });
                }
                break
                case 'disable':
                  if (!Data) return await interaction.reply({ content: 'There is no captcha system setup', ephemeral: true});
                  await capSchema.deleteMany({ Guild: interaction.guild.id});

                  const embed = new EmbedBuilder()
                  .setColor("Blurple")
                  .setDescription(":thumbsup: The captcha system has been disabled")

                  await interaction.reply({ embeds: [embed] })
        }
    }
}