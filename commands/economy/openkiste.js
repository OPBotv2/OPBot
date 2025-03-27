const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/mysql');
const inv = require('../../database/inventory');
const economy = require('../../database/economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('openkiste')
        .setDescription('Öffne eine Kiste aus deinem Inventar')
        .addStringOption(option =>
            option.setName('item')
                .setDescription('Name der Kiste')
                .setRequired(true)),

    async execute(interaction) {
        const itemName = interaction.options.getString('item');
        const userId = interaction.user.id;

        const crate = await inv.getItemByName(itemName);
        if (!crate || crate.type !== 'crate') {
            return interaction.reply({ content: '❌ Das ist keine gültige Kiste.', flags: 64 });
        }

        const [invCheck] = await db.query(
            'SELECT quantity FROM inventory WHERE user_id = ? AND item_id = ?',
            [userId, crate.id]
        );

        const owned = invCheck[0]?.quantity ?? 0;

        if (owned < 1) {
            return interaction.reply({ content: '❌ Du besitzt keine solche Kiste.', flags: 64 });
        }

        // Reduziere Kiste
        await db.query(
            'UPDATE inventory SET quantity = quantity - 1 WHERE user_id = ? AND item_id = ?',
            [userId, crate.id]
        );

        // Ziehe zufällige Belohnung
        const reward = await inv.getRandomReward();

        // Füge Belohnung hinzu
        if (reward) {
            await inv.buyItem(userId, reward.id);
        }

        // Alternativ: Coins geben statt Item
        const giveCoins = !reward && Math.random() < 0.5;
        const coinAmount = Math.floor(Math.random() * 1000) + 200;

        if (giveCoins) {
            await economy.addMoney(userId, coinAmount);
        }

        const embed = new EmbedBuilder()
            .setTitle('🎁 Kiste geöffnet!')
            .setDescription(
                reward
                    ? `Du hast **${reward.name}** erhalten! 🎉`
                    : `💰 Du hast **${coinAmount} Coins** aus der Kiste gezogen!`
            )
            .setColor(0xE67E22)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
