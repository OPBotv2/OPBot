const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ComponentType
} = require('discord.js');
const { getAllChangelogs, getChangelogByVersion } = require('../../database/changelogs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('changelog')
        .setDescription('Zeigt die letzten Änderungen am Bot')
        .addStringOption(option =>
            option.setName('version')
                .setDescription('Zeige direkt eine bestimmte Version')
                .setRequired(false)
        ),

    async execute(interaction) {
        const versionInput = interaction.options.getString('version');

        const changelogs = await getAllChangelogs();
        if (!changelogs.length) {
            return interaction.reply({ content: '❌ Keine Changelogs gefunden.', ephemeral: true });
        }

        // Wenn bestimmte Version gewählt wurde
        if (versionInput) {
            const log = await getChangelogByVersion(versionInput);
            if (!log) {
                return interaction.reply({
                    content: `❌ Keine Changelog-Einträge für Version \`${versionInput}\` gefunden.`,
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setTitle(`📦 Changelog ${log.version}`)
                .setDescription(log.entries.map(e => `• ${e}`).join('\n'))
                .setColor(0x3498DB)
                .setFooter({ text: `Veröffentlicht am ${log.date}` })
                .setTimestamp();

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // Wenn keine Version angegeben → neueste anzeigen
        const latest = changelogs[0];
        const embed = new EmbedBuilder()
            .setTitle(`📦 Neueste Version: ${latest.version}`)
            .setDescription(latest.entries.map(e => `• ${e}`).join('\n'))
            .setColor(0x3498DB)
            .setFooter({ text: `Veröffentlicht am ${latest.date}` })
            .setTimestamp();

        const select = new StringSelectMenuBuilder()
            .setCustomId('select_changelog')
            .setPlaceholder('Wähle eine andere Version')
            .addOptions(
                changelogs.map(log => ({
                    label: log.version,
                    description: `Änderungen vom ${log.date}`,
                    value: log.version
                }))
            );

        const row = new ActionRowBuilder().addComponents(select);

        const reply = await interaction.reply({
            content: '📢 Hier ist der aktuellste Changelog. Wähle eine Version für mehr:',
            embeds: [embed],
            components: [row],
            ephemeral: true
        });

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 60000
        });

        collector.on('collect', async selectInteraction => {
            const selected = selectInteraction.values[0];
            const log = await getChangelogByVersion(selected);
            if (!log) return;

            const embed = new EmbedBuilder()
                .setTitle(`📦 Changelog ${log.version}`)
                .setDescription(log.entries.map(e => `• ${e}`).join('\n'))
                .setColor(0x3498DB)
                .setFooter({ text: `Veröffentlicht am ${log.date}` })
                .setTimestamp();

            await selectInteraction.update({
                content: `📦 Changelog für Version \`${log.version}\``,
                embeds: [embed],
                components: []
            });
        });

        collector.on('end', async () => {
            try {
                await reply.edit({ components: [] });
            } catch (e) {}
        });
    }
};
