const {
    SlashCommandBuilder, EmbedBuilder,
    ActionRowBuilder, StringSelectMenuBuilder,
    ButtonBuilder, ButtonStyle, ComponentType, PermissionFlagsBits
} = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Zeigt alle verfügbaren Befehle'),

    async execute(interaction) {
        const userMember = interaction.member;
        const client = interaction.client;
        const commandsPath = path.join(__dirname, '..');
        const categories = fs.readdirSync(commandsPath).sort();

        const commandStore = {}; // { [category]: [commands...] }

        for (const category of categories) {
            const categoryPath = path.join(commandsPath, category);
            const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js')).sort();

            const commands = [];

            for (const file of files) {
                const cmd = require(path.join(categoryPath, file));
                if (!cmd?.data?.name) continue;

                const perms = cmd.data.default_member_permissions;
                const hasPermission = !perms || userMember.permissions.has(BigInt(perms));

                if (!hasPermission) continue;

                commands.push({
                    name: cmd.data.name,
                    description: cmd.data.description,
                    id: client.application.commands.cache.find(c => c.name === cmd.data.name)?.id ?? '…'
                });
            }

            if (commands.length > 0) {
                commandStore[category] = commands;
            }
        }

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('help_select')
            .setPlaceholder('Wähle eine Kategorie')
            .addOptions(
                Object.keys(commandStore).map(cat => ({
                    label: cat.charAt(0).toUpperCase() + cat.slice(1),
                    value: cat
                }))
            );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const embed = new EmbedBuilder()
            .setTitle('📚 Hilfe-Menü')
            .setDescription('Wähle eine Kategorie aus dem Dropdown-Menü unten.')
            .setColor(0x3498DB)
            .setFooter({ text: `Angefordert von ${interaction.user.tag}` })
            .setTimestamp();

        const reply = await interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        });

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 60000
        });

        collector.on('collect', async selectInteraction => {
            if (selectInteraction.user.id !== interaction.user.id)
                return selectInteraction.reply({ content: '❌ Nicht für dich bestimmt.', ephemeral: true });

            const category = selectInteraction.values[0];
            const commands = commandStore[category];

            let page = 0;
            const pageSize = 5;
            const totalPages = Math.ceil(commands.length / pageSize);

            const getPageEmbed = () => {
                const current = commands.slice(page * pageSize, (page + 1) * pageSize);
                const fieldText = current
                    .map(cmd => `</${cmd.name}:${cmd.id}> – ${cmd.description}`)
                    .join('\n');

                return new EmbedBuilder()
                    .setTitle(`📁 Kategorie: ${category}`)
                    .setDescription(fieldText || 'Keine Befehle gefunden.')
                    .setFooter({ text: `Seite ${page + 1} von ${totalPages}` })
                    .setColor(0x2ECC71)
                    .setTimestamp();
            };

            const buildButtons = () =>
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`help/prev`)
                        .setLabel('◀️ Zurück')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(page === 0),
                    new ButtonBuilder()
                        .setCustomId(`help/next`)
                        .setLabel('▶️ Weiter')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(page >= totalPages - 1)
                );            

            await selectInteraction.update({
                embeds: [getPageEmbed()],
                components: [row, buildButtons()]
            });

            const buttonCollector = reply.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 60000
            });

            buttonCollector.on('collect', async btnInteraction => {
                if (btnInteraction.user.id !== interaction.user.id)
                    return btnInteraction.reply({ content: '❌ Nicht für dich bestimmt.', ephemeral: true });

                if (btnInteraction.customId === 'prev') page--;
                if (btnInteraction.customId === 'next') page++;

                await btnInteraction.update({
                    embeds: [getPageEmbed()],
                    components: [row, buildButtons()]
                }).catch(() => {});
            });

            buttonCollector.on('end', async () => {
                await reply.edit({
                    components: [
                        row,
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId('help/prev')
                                .setLabel('◀️ Zurück')
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setCustomId('help/next')
                                .setLabel('▶️ Weiter')
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true)
                        )                        
                    ]
                }).catch(() => {});
            });
        });
    }
};
