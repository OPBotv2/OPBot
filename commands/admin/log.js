const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const logger = require('../../database/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log')
        .setDescription('Zeigt die letzten Economy-Aktionen eines Benutzers')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Der Benutzer, dessen Logs du sehen willst')
                .setRequired(true)),

    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const logs = await logger.getLogs(target.id);

        if (!logs.length) {
            return interaction.reply({ content: '📭 Keine Logs gefunden.', flags: 64 });
        }

        const lines = logs.map(log => {
            const date = new Date(log.timestamp).toLocaleString();
            return `📄 **${log.type.toUpperCase()}** — ${log.details} (${date})`;
        });

        const embed = new EmbedBuilder()
            .setTitle(`📝 Logs für ${target.tag}`)
            .setDescription(lines.join('\n'))
            .setColor(0x95A5A6);

        await interaction.reply({ embeds: [embed] });
    }
};
