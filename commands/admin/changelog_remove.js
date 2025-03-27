const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');
const fs = require('fs');
const path = require('path');
const { deleteChangelogFromDB } = require('../../database/changelogs');

const changelogPath = path.join(__dirname, '..', '..', 'data', 'changelogs.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('changelogremove')
        .setDescription('Löscht einen bestimmten Changelog-Eintrag')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('version')
                .setDescription('Version, z. B. v1.3.0')
                .setRequired(true)
        ),

    async execute(interaction) {
        const version = interaction.options.getString('version');
        let changelogs = [];

        try {
            changelogs = JSON.parse(fs.readFileSync(changelogPath, 'utf-8'));
        } catch (err) {
            return interaction.reply({ content: '❌ Fehler beim Laden der Changelog-Datei.', ephemeral: true });
        }

        const index = changelogs.findIndex(c => c.version === version);
        if (index === -1) {
            return interaction.reply({ content: `❌ Keine Changelog-Version \`${version}\` gefunden.`, ephemeral: true });
        }

        changelogs.splice(index, 1);

        try {
            fs.writeFileSync(changelogPath, JSON.stringify(changelogs, null, 2), 'utf-8');
        } catch (err) {
            return interaction.reply({ content: '❌ Fehler beim Speichern nach dem Entfernen.', ephemeral: true });
        }

        const dbResult = await deleteChangelogFromDB(version);

        await interaction.reply({
            content: `🗑️ Version \`${version}\` wurde erfolgreich aus JSON ${dbResult ? 'und Datenbank' : '(aber nicht aus der DB)'} entfernt.`,
            ephemeral: true
        });
    }
};
