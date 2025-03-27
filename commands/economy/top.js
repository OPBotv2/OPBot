const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const economy = require('../../database/economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top')
        .setDescription('Zeigt die Top 10 reichsten Benutzer'),

    async execute(interaction) {
        const top = await economy.getTopUsers();

        const description = top
            .map((u, i) => `**${i + 1}.** <@${u.user_id}> – 💰 ${u.balance.toLocaleString()} Coins`)
            .join('\n');

        const embed = new EmbedBuilder()
            .setTitle('🏆 Top 10')
            .setDescription(description || 'Keine Daten gefunden.')
            .setColor(0xF39C12)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
