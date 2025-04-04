const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
const { createTicket } = require('../../database/tickets');

module.exports = {
  customId: 'createTicket',
  async execute(interaction) {
    const guild = interaction.guild;
    const user = interaction.user;

    const channelName = `ticket-${user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    const existing = guild.channels.cache.find(c => c.name === channelName);
    if (existing) {
      return interaction.reply({ content: 'Du hast bereits ein offenes Ticket.', ephemeral: true });
    }

    const ticketChannel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          deny: [PermissionFlagsBits.ViewChannel]
        },
        {
          id: user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
        },
        {
          id: interaction.client.user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
        }
      ]
    });

    await createTicket({
      guildId: guild.id,
      userId: user.id,
      channelId: ticketChannel.id,
      category: 'Unbekannt'
    });

    const closeButton = new ButtonBuilder()
      .setCustomId('closeTicket')
      .setLabel('🔒 Ticket schließen')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(closeButton);

    await ticketChannel.send({
      content: `Willkommen <@${user.id}>! Das Support-Team wird sich bald melden.`,
      components: [row]
    });

    await interaction.reply({ content: `🎟️ Dein Ticket wurde erstellt: <#${ticketChannel.id}>`, ephemeral: true });
  }
};
