const { PermissionFlagsBits } = require('discord.js');
const { closeTicket, getTicketByChannelId } = require('../../database/tickets');

module.exports = {
  customId: 'closeTicket',
  async execute(interaction) {
    const channel = interaction.channel;
    const guildId = interaction.guild.id;

    const ticket = await getTicketByChannelId(channel.id);
    if (!ticket) {
      return interaction.reply({ content: '❌ Dieses Ticket ist nicht in der Datenbank registriert.', ephemeral: true });
    }

    if (ticket.guild_id !== guildId) {
      return interaction.reply({ content: '❌ Du kannst dieses Ticket nicht schließen.', ephemeral: true });
    }

    const member = interaction.member;
    const isOwner = ticket.user_id === member.id;
    const isTeam = member.permissions.has(PermissionFlagsBits.ManageMessages);

    if (!isOwner && !isTeam) {
      return interaction.reply({ content: '❌ Du darfst dieses Ticket nicht schließen.', ephemeral: true });
    }

    await closeTicket(channel.id, guildId);

    await channel.send(`🔒 Ticket wurde von <@${member.id}> geschlossen.`);
    await interaction.reply({ content: '✅ Ticket wird in 5 Sekunden gelöscht.', ephemeral: true });

    setTimeout(() => {
      channel.delete().catch(() => {});
    }, 5000);
  }
};
