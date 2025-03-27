const {
    SlashCommandBuilder, PermissionFlagsBits,
    ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kickt einen Benutzer mit Bestätigung.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Der Benutzer, der gekickt werden soll')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('grund')
                .setDescription('Grund für den Kick')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('grund') || 'Kein Grund angegeben';
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({ content: '❌ Benutzer nicht gefunden.', flags: 64 });
        }

        const embed = new EmbedBuilder()
            .setTitle('🦵 Kick bestätigen')
            .setColor(0xF1C40F)
            .addFields(
                { name: '👤 Benutzer', value: `${user.tag} (${user.id})`, inline: true },
                { name: '🛠️ Von', value: `${interaction.user.tag}`, inline: true },
                { name: '📄 Grund', value: reason }
            )
            .setFooter({ text: 'Du hast 30 Sekunden Zeit zur Bestätigung.' });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('mod:kick_confirm:yes')
                .setLabel('✅ Ja')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('mod:kick_confirm:no')
                .setLabel('❌ Nein')
                .setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({ embeds: [embed], components: [row], flags: 64 });
    }
};
