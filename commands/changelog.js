const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../config.json'); // Hier nehmen wir an, dass die erforderliche Rollen-ID in config.json gespeichert ist

module.exports = {
  data: new SlashCommandBuilder()
    .setName('changelog')
    .setDescription('Zeigt das neueste Changelog an')
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages), // Mindestberechtigung, damit Slash-Command sichtbar ist
  async execute(interaction) {
    const requiredRoleId = config.requiredRoleId; // Füge die Rollen-ID für Berechtigung in config.json ein

    // Überprüfen, ob der Benutzer die erforderliche Rolle hat
    if (!interaction.member.roles.cache.has(requiredRoleId)) {
      return interaction.reply({ content: '❌ Du hast nicht die erforderliche Rolle, um diesen Befehl auszuführen.', ephemeral: true });
    }

    // Erstelle das Embed für das Changelog
    const changelogEmbed = new EmbedBuilder()
      .setTitle('📜 Changelog')
      .setDescription('Hier ist das neueste Changelog:')
      .addFields(
        { name: 'Version 1.0.0', value: '- Erste Wartungsarbeiten', inline: false }
      )
      .setColor(0x00AE86)
      .setTimestamp();

    await interaction.reply({ embeds: [changelogEmbed] });
  },
};
