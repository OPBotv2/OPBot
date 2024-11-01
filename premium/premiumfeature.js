const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('premiumfeature')
    .setDescription('Ein exklusiver Premium-Befehl nur für Premium-Nutzer'),
  async execute(interaction) {
    const premiumEmbed = new EmbedBuilder()
      .setTitle('🌟 Premium-Feature')
      .setDescription('Dies ist ein exklusiver Premium-Befehl.')
      .setColor(0xFFD700); // Goldene Farbe für Premium

    try {
      await interaction.reply({ embeds: [premiumEmbed] });
      console.log('Premium-Feature-Embed erfolgreich gesendet.');
    } catch (error) {
      console.error('Fehler beim Senden des Premium-Feature-Embeds:', error);
      await interaction.reply('Es gab ein Problem beim Ausführen dieses Premium-Befehls.', { ephemeral: true });
    }
  },
};
