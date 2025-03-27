const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { loadButtons } = require('../../handlers/buttonHandler');
const log = require('../../utils/log');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Lädt bestimmte Komponenten des Bots neu')
        .addStringOption(option =>
            option.setName('typ')
                .setDescription('Was soll neu geladen werden?')
                .addChoices(
                    { name: 'Buttons', value: 'buttons' }
                    // später: weitere wie commands, events etc.
                )
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const type = interaction.options.getString('typ');

        if (type === 'buttons') {
            try {
                loadButtons();
                log.info(`Button-Handler wurde manuell neu geladen von ${interaction.user.tag}`);
                await interaction.reply({ content: '✅ Buttons erfolgreich neu geladen.', ephemeral: true });
            } catch (err) {
                log.error(`Fehler beim Button-Reload: ${err.message}`);
                await interaction.reply({ content: '❌ Fehler beim Neuladen der Buttons.', ephemeral: true });
            }
        } else {
            await interaction.reply({ content: '❓ Unbekannter Reload-Typ.', ephemeral: true });
        }
    }
};
