const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Zeigt den Bot- und API-Ping an'),
  async execute(interaction) {
    // Erzeuge ein Embed mit Ping-Informationen
    const embed = new EmbedBuilder()
      .setColor(0x00ff00) // Farbe des Embeds (grün)
      .setTitle('🏓 Pong!')
      .addFields(
        { name: 'Discord API Ping', value: `${interaction.client.ws.ping}ms`, inline: false },
        { name: 'MongoDB Status', value: 'Kommt bald!', inline: false }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
