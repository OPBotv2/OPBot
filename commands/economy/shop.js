const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const inv = require('../../database/inventory');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Zeigt alle verfügbaren Shop-Items'),

    async execute(interaction) {
        const items = await inv.getShopItems();

        const desc = items.map(i => `**${i.name}** – 💰 ${i.price} Coins`).join('\n');

        const embed = new EmbedBuilder()
            .setTitle('🛒 Shop')
            .setDescription(desc || 'Keine Items verfügbar.')
            .setColor(0x3498DB);

        await interaction.reply({ embeds: [embed] });
    }
};
