const { getButtonHandler } = require('../handlers/buttonHandler');
const log = require('../utils/log');

module.exports = async (interaction, client) => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
            log.info(`SlashCommand ausgeführt: /${interaction.commandName} von ${interaction.user.tag}`);
        } catch (err) {
            log.error(`Fehler bei /${interaction.commandName}: ${err.message}`);
            if (!interaction.replied && !interaction.deferred) {
                interaction.reply({ content: '❌ Fehler beim Ausführen des Befehls.', flags: 64 });
            }
        }
    }

    if (interaction.isButton()) {
        const customId = interaction.customId;
        const handler = getButtonHandler(customId);

        if (!handler) {
            // Kein externer Button – z. B. intern im Help-Command genutzt
            log.warn(`Kein Button-Handler für "${customId}" gefunden.`);
            return;
        }

        try {
            await handler(interaction, client);
            log.info(`Button ausgeführt: ${customId} von ${interaction.user.tag}`);
        } catch (err) {
            log.error(`Fehler im Button "${customId}": ${err.message}`);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '❌ Interner Fehler im Button-Handler.',
                    ephemeral: true
                }).catch(() => {});
            }
        }
    }
};
