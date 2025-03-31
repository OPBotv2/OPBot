const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ChannelType
} = require('discord.js');
const { saveChangelogToDB, getChangelogByVersion } = require('../../database/changelogs');
const { getChangelogChannel } = require('../../database/changelog_channels');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('changelogadd')
        .setDescription('Fügt einen neuen Changelog-Eintrag hinzu und postet ihn ins Forum/TextChannel')
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
        const guildId = interaction.guild?.id;

        if (!entries.length) {
            return interaction.reply({ content: '❌ Keine gültigen Einträge gefunden.', ephemeral: true });
        }

        const existing = await getChangelogByVersion(version, guildId);
        if (existing) {
            return interaction.reply({ content: `❌ Version \`${version}\` existiert bereits.`, ephemeral: true });
        }

        try {
            await saveChangelogToDB(version, date, entries, guildId);
        } catch (err) {
            console.error('❌ Fehler beim Speichern des Changelogs in die DB:', err);
            return interaction.reply({ content: '❌ Fehler beim Speichern.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle(`📦 Changelog ${version}`)
            .setDescription(entries.map(e => `• ${e}`).join('\n'))
            .setColor(0x5865F2)
            .setFooter({ text: `Veröffentlicht am ${date}` })
            .setTimestamp();

        // 🔄 Channel-ID aus der DB laden
        const channelId = await getChangelogChannel(guildId);
        if (!channelId) {
            return interaction.reply({ content: '⚠️ Es wurde kein Changelog-Channel für diese Guild gesetzt. Nutze `/setchangelogchannel`.', ephemeral: true });
        }

        const logChannel = interaction.client.channels.cache.get(channelId);

        if (!logChannel) {
            return interaction.reply({ content: '❌ Der gesetzte Channel konnte nicht gefunden werden.', ephemeral: true });
        }

        try {
            if (logChannel.type === ChannelType.GuildForum) {
                await logChannel.threads.create({
                    name: `📦 ${version} – ${date}`,
                    message: { embeds: [embed] }
                });
            } else {
                await logChannel.send({ embeds: [embed] });
            }
        } catch (err) {
            console.warn('❌ Fehler beim Posten:', err);
            return interaction.reply({ content: '❌ Fehler beim Senden in den Changelog-Channel.', ephemeral: true });
        }

        await interaction.reply({ content: `✅ Changelog \`${version}\` wurde veröffentlicht.`, ephemeral: true });
    }
};