const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { setChangelogChannel } = require('../../database/changelog_channels');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setchangelogchannel')
        .setDescription('Setzt den Channel für Changelog-Ankündigungen (Text oder Forum)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Zielchannel für Changelogs')
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildForum)
                .setRequired(true)
        ),

    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        await setChangelogChannel(interaction.guild.id, channel.id);

        await interaction.reply({
            content: `📢 Changelog-Channel erfolgreich gesetzt auf <#${channel.id}>.`,
            ephemeral: true
        });
    }
};
