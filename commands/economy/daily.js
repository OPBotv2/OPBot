const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const economy = require('../../database/economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Erhalte deine tägliche Belohnung'),

    async execute(interaction) {
        const userId = interaction.user.id;
        const now = Date.now();
        const last = await economy.getLastDaily(userId);

        const diff = now - last;
        const hours = 24;
        const ms = hours * 60 * 60 * 1000;

        if (diff < ms) {
            const remaining = ms - diff;
            const remainingHours = Math.floor(remaining / 3600000);
            const remainingMinutes = Math.floor((remaining % 3600000) / 60000);
            return interaction.reply({
                content: `🕒 Du kannst deine tägliche Belohnung wieder in **${remainingHours}h ${remainingMinutes}m** abholen.`,
                flags: 64
            });
        }

        const reward = 500;
        await economy.addMoney(userId, reward);
        await economy.setLastDaily(userId, now);

        const embed = new EmbedBuilder()
            .setTitle('🎁 Tägliche Belohnung')
            .setDescription(`Du hast **${reward.toLocaleString()}** Coins erhalten!`)
            .setColor(0x2ECC71)
            .setTimestamp();

        await interaction.reply({ embeds: [embed], flags: 64 });
    }
};
