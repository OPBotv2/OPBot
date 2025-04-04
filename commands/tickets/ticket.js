const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Sendet ein Embed mit einem Button zum Erstellen eines Tickets')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🎟️ Support-Tickets')
      .setDescription('Klicke auf den Button unten, um ein neues Ticket zu öffnen.\n\nUnser Team wird sich so schnell wie möglich um dein Anliegen kümmern.')
      .setColor(0x00AEFF);

    const button = new ButtonBuilder()
      .setCustomId('createTicket')
      .setLabel('🎫 Ticket öffnen')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};
