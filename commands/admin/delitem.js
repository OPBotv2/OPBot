const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../../database/mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delitem')
        .setDescription('Löscht ein Item aus dem Shop')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Name des zu löschenden Items')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const name = interaction.options.getString('name');

        const [existing] = await db.query('SELECT * FROM items WHERE name = ?', [name]);
        if (existing.length === 0) {
            return interaction.reply({ content: '❌ Kein Item mit diesem Namen gefunden.', flags: 64 });
        }

        await db.query('DELETE FROM items WHERE name = ?', [name]);

        const embed = new EmbedBuilder()
            .setTitle('🗑️ Item gelöscht')
            .setDescription(`Das Item **${name}** wurde aus dem Shop entfernt.`)
            .setColor(0xE74C3C);

        await interaction.reply({ embeds: [embed] });
    }
};
