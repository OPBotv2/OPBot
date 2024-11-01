const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Zeigt eine Liste aller verfügbaren Befehle und deren Beschreibungen an'),
  async execute(interaction) {
    const { client } = interaction;

    // Erstelle ein Embed für die Hilfe
    const helpEmbed = new EmbedBuilder()
      .setTitle(`📜 Hilfe - Befehlsliste`)
      .setDescription(`Hier sind alle verfügbaren Befehle (${client.commands.size}):`)
      .setColor(0x0099ff)
      .setTimestamp();

    // Alle Befehle durchlaufen und zum Embed hinzufügen
    client.commands.forEach(command => {
      helpEmbed.addFields({ name: `/${command.data.name}`, value: command.data.description || 'Keine Beschreibung verfügbar', inline: false });
    });

    await interaction.reply({ embeds: [helpEmbed] });
  },
};
