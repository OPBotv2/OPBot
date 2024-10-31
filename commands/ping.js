const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Antwortet mit "Pong!"'),
  async execute(interaction) {
    await interaction.reply('Pong!!');
  },
};
