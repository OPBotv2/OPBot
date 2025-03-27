const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const economy = require('../../database/economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Zeigt dein Guthaben an'),

    async execute(interaction) {
        const balance = await economy.getBalance(interaction.user.id);

        const embed = new EmbedBuilder()
            .setTitle('💰 Kontostand')
            .setDescription(`Du hast **${balance.toLocaleString()}** Coins.`)
            .setColor(0x2ECC71);

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
