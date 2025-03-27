const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const economy = require('../../database/economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addmoney')
        .setDescription('Füge einem Benutzer Geld hinzu')
        .addUserOption(option =>
            option.setName('user').setDescription('Der Benutzer').setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount').setDescription('Betrag').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        if (amount <= 0) {
            return interaction.reply({ content: '❌ Betrag muss größer als 0 sein.', flags: 64 });
        }

        await economy.addMoney(target.id, amount);

        const embed = new EmbedBuilder()
            .setTitle('💸 Guthaben geändert')
            .setDescription(`✅ ${target.tag} hat **${amount.toLocaleString()}** Coins erhalten.`)
            .setColor(0x3498DB);

        await interaction.reply({ embeds: [embed] });
    }
};
