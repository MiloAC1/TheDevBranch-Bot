const { SlashCommandBuilder } = require('discord.js');
const { loadImage, createCanvas } = require('canvas');
const axios = require('axios');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('austinafy')
    .setDescription('Austinafy an image.'),
  async execute(interaction) {

    const channel = interaction.channel;
    const commandInteraction = interaction;
    let attachment = null;

    if (interaction.options.get('image') && interaction.options.get('image').channel) {
      // User is replying to an image in a channel
      const imageMessage = await channel.messages.fetch(interaction.options.get('image').messageId);
      console.log('Fetched image message:', imageMessage);
      if (imageMessage.attachments.size > 0) {
        attachment = imageMessage.attachments.first();
      }
    } else {
      // User did not reply to an image, search through the last 40 messages
      const messages = await channel.messages.fetch({ limit: 40 });
      messages.some((message) => {
        if (message.attachments.size > 0) {
          attachment = message.attachments.first();
          return true;
        }
      });
    }

    if (attachment) {
      const attachmentUrl = attachment.url;
      const attachmentFileName = attachment.name;
      console.log('Attachment URL and filename:', attachmentUrl, attachmentFileName);

      // Load the attachment image
      const attachmentImage = await loadImage(attachmentUrl);
      console.log('Current working directory:', process.cwd());
      // Load the local image to be overlaid
      console.log('Loading local image: ./austin.png');
      const localImage = await loadImage('./austin.png');

      // Create a canvas
      const canvas = createCanvas(attachmentImage.width, attachmentImage.height);
      const ctx = canvas.getContext('2d');

      // Draw the attachment image onto the canvas
      ctx.drawImage(attachmentImage, 0, 0);

      // Draw the local image onto the canvas
      ctx.drawImage(localImage, 0, 0, attachmentImage.width, attachmentImage.height);

      // Convert the canvas to a buffer
      const buffer = canvas.toBuffer('image/png');

      // Create a temporary file path
      const tempFilePath = `./temp/${Date.now()}.png`;

      // Write the buffer to a temporary file
      fs.writeFileSync(tempFilePath, buffer);

      // Send an initial response
      await commandInteraction.deferReply();

      // Send the temporary file as the follow-up message
      await commandInteraction.followUp({
        content: 'Austinfied!',
        files: [{
          attachment: tempFilePath,
          name: 'austinfied.png'
        }]
      });

      // Delete the temporary file
      fs.unlinkSync(tempFilePath);
    } else {
      console.log('No attachment found');
      await commandInteraction.reply('No image found.'); // If no attachment found, reply with this message.
    }
  },
};
