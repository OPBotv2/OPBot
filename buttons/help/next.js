const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = async (interaction) => {
    try {
        const message = interaction.message;
        const embed = message.embeds[0];
        const footer = embed?.footer?.text || '';
        const match = footer.match(/Seite (\d+) von (\d+)/);

        if (!match) return;

        let page = parseInt(match[1]) - 1;
        const totalPages = parseInt(match[2]);

        if (page >= totalPages - 1) return;
        page++;

        const commands = getCommandsFromEmbed(embed);
        if (!commands.length) return;

        const start = page * 5;
        const sliced = commands.slice(start, start + 5);
        if (!sliced.length) return;

        const fieldText = sliced
            .map(cmd => `</${cmd.name}:${cmd.id}> – ${cmd.description}`)
            .join('\n');

        const newEmbed = EmbedBuilder.from(embed)
            .setDescription(fieldText)
            .setFooter({ text: `Seite ${page + 1} von ${totalPages}` });

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('help/prev')
                .setLabel('◀️ Zurück')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(page === 0),
            new ButtonBuilder()
                .setCustomId('help/next')
                .setLabel('▶️ Weiter')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(page >= totalPages - 1)
        );

        const originalRow = (
            message.components?.[0]?.components?.length
                ? message.components[0]
                : new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('placeholder')
                        .setLabel('Kein Menü verfügbar')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true)
                )
        );

        await interaction.update({
            embeds: [newEmbed],
            components: [originalRow, buttons]
        });
    } catch (err) {
        console.error(`❌ Fehler im Button "help/next":`, err);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: '❌ Fehler beim Blättern.', ephemeral: true }).catch(() => {});
        }
    }
};

function getCommandsFromEmbed(embed) {
    const lines = embed.description?.split('\n') || [];
    return lines.map(line => {
        const match = line.match(/^<\/(.+?):(.+?)> – (.+)$/);
        if (!match) return null;
        return { name: match[1], id: match[2], description: match[3] };
    }).filter(Boolean);
}
