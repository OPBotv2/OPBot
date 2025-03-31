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
        const guildId = interaction.guild?.id;

        if (!guildId) {
            return interaction.reply({ content: '❌ Dieser Befehl kann nur in einem Server verwendet werden.', ephemeral: true });
        }

        const changelogs = await getAllChangelogs(guildId);
        if (!changelogs.length) {
            return interaction.reply({ content: '❌ Keine Changelogs für diesen Server gefunden.', ephemeral: true });
        }

        // 🔍 Direkt nach Version gefragt?
        if (versionInput) {
            const log = await getChangelogByVersion(versionInput, guildId);
            if (!log) {
                return interaction.reply({
                    content: `❌ Kein Changelog für Version \`${versionInput}\` gefunden.`,
                    ephemeral: true
                });
            }

            const embed = createChangelogEmbed(log);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // 📦 Neueste anzeigen
        const latest = changelogs[0];
        const embed = createChangelogEmbed(latest);

        // 🔽 Dropdown mit max. 25 Versionen (Discord Limit)
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('select_changelog')
            .setPlaceholder('Wähle eine Version aus')
            .addOptions(
                changelogs.slice(0, 25).map(log => ({
                    label: log.version,
                    description: `Änderungen vom ${log.date}`,
                    value: log.version
                }))
            );

        const row = new ActionRowBuilder().addComponents(selectMenu);

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
            const log = await getChangelogByVersion(selected, guildId);
            if (!log) return;

            const embed = createChangelogEmbed(log);
            await selectInteraction.update({
                content: `📦 Changelog für Version \`${log.version}\`:`,
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

// 🔧 Hilfsfunktion für Embed
function createChangelogEmbed(log) {
    return new EmbedBuilder()
        .setTitle(`📦 Changelog ${log.version}`)
        .setDescription(log.entries.map(e => `• ${e}`).join('\n'))
        .setColor(0x3498DB)
        .setFooter({ text: `Veröffentlicht am ${log.date}` })
        .setTimestamp();
}
