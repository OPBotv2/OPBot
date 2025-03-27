const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const economy = require('../../database/economy');
const inv = require('../../database/inventory');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Kaufe ein Item aus dem Shop')
        .addStringOption(option =>
            option.setName('item')
                .setDescription('Name des Items')
                .setRequired(true)),

    async execute(interaction) {
        const itemName = interaction.options.getString('item');
        const userId = interaction.user.id;

        const item = await inv.getItemByName(itemName);
        if (!item) {
            return interaction.reply({ content: '❌ Item nicht gefunden.', flags: 64 });
        }

        const balance = await economy.getBalance(userId);
        if (balance < item.price) {
            return interaction.reply({ content: `❌ Du hast nicht genug Coins. (${item.price} benötigt)`, flags: 64 });
        }

        await economy.addMoney(userId, -item.price);
        await inv.buyItem(userId, item.id);

        const embed = new EmbedBuilder()
            .setTitle('🛍️ Kauf erfolgreich')
            .setDescription(`Du hast **${item.name}** für **${item.price}** Coins gekauft.`)
            .setColor(0x2ECC71);

        await interaction.reply({ embeds: [embed] });
    }
};
