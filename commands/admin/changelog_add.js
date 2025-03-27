const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ChannelType
} = require('discord.js');
const fs = require('fs');
const path = require('path');
const { saveChangelogToDB } = require('../../database/changelogs');
require('dotenv').config();

const changelogPath = path.join(__dirname, '..', '..', 'data', 'changelogs.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('changelogadd')
        .setDescription('Fügt einen neuen Changelog-Eintrag hinzu und postet ihn ins Forum')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('version')
                .setDescription('Version, z. B. v1.4.0')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('einträge')
                .setDescription('Änderungen, getrennt mit | (Pipe)')
                .setRequired(true)
        ),

    async execute(interaction) {
        const version = interaction.options.getString('version');
        const rawEntries = interaction.options.getString('einträge');
        const entries = rawEntries.split('|').map(e => e.trim()).filter(Boolean);
        const date = new Date().toISOString().split('T')[0];

        if (!entries.length) {
            return interaction.reply({ content: '❌ Keine gültigen Einträge gefunden.', ephemeral: true });
        }

        let changelogs = [];
        try {
            changelogs = JSON.parse(fs.readFileSync(changelogPath, 'utf-8'));
        } catch (err) {
            return interaction.reply({ content: '❌ Fehler beim Laden der Datei.', ephemeral: true });
        }

        if (changelogs.some(c => c.version === version)) {
            return interaction.reply({ content: `❌ Version \`${version}\` existiert bereits.`, ephemeral: true });
        }

        const newLog = { version, date, entries };
        changelogs.unshift(newLog);

        try {
            fs.writeFileSync(changelogPath, JSON.stringify(changelogs, null, 2), 'utf-8');
            await saveChangelogToDB(version, date, entries);
        } catch (err) {
            return interaction.reply({ content: '❌ Fehler beim Speichern in JSON oder Datenbank.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle(`📦 Changelog ${version}`)
            .setDescription(entries.map(e => `• ${e}`).join('\n'))
            .setColor(0x5865F2)
            .setFooter({ text: `Veröffentlicht am ${date}` })
            .setTimestamp();

        const channelId = process.env.CHANGELOG_CHANNEL_ID;
        const logChannel = interaction.client.channels.cache.get(channelId);

        if (!logChannel) {
            console.warn('❌ Forum-Channel nicht gefunden.');
        } else if (logChannel.type !== ChannelType.GuildForum) {
            console.warn('❌ Der angegebene Channel ist kein Forum.');
        } else {
            try {
                await logChannel.threads.create({
                    name: `📦 ${version} – ${date}`,
                    message: { embeds: [embed] }
                });
            } catch (err) {
                console.warn('❌ Fehler beim Erstellen des Forum-Threads:', err);
            }
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
