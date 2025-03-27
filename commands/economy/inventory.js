const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const inv = require('../../database/inventory');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('Zeigt deine gekauften Items'),

    async execute(interaction) {
        const items = await inv.getUserInventory(interaction.user.id);

        const desc = items.length > 0
            ? items.map(i => `🧩 **${i.name}** × ${i.quantity}`).join('\n')
            : 'Du besitzt noch keine Items.';

        const embed = new EmbedBuilder()
            .setTitle('🎒 Inventar')
            .setDescription(desc)
            .setColor(0x9B59B6);

        await interaction.reply({ embeds: [embed], flags: 64 });
    }
};
