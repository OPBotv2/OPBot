const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/mysql');
const inv = require('../../database/inventory');
const itemRoles = require('../../utils/itemRoles');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('use')
        .setDescription('Benutze ein Item aus deinem Inventar')
        .addStringOption(option =>
            option.setName('item')
                .setDescription('Name des Items')
                .setRequired(true)),

    async execute(interaction) {
        const itemName = interaction.options.getString('item');
        const userId = interaction.user.id;
        const member = interaction.member;

        const item = await inv.getItemByName(itemName);
        if (!item) {
            return interaction.reply({ content: '❌ Item nicht gefunden.', flags: 64 });
        }

        // Check Besitz
        const [invCheck] = await db.query(
            'SELECT quantity FROM inventory WHERE user_id = ? AND item_id = ?',
            [userId, item.id]
        );
        const owned = invCheck[0]?.quantity ?? 0;
        if (owned < 1) {
            return interaction.reply({ content: '❌ Du besitzt dieses Item nicht.', flags: 64 });
        }

        // Reduziere Anzahl um 1
        await db.query(
            'UPDATE inventory SET quantity = quantity - 1 WHERE user_id = ? AND item_id = ?',
            [userId, item.id]
        );

        let resultText = `Du hast **${item.name}** benutzt! 🎉`;

        // Rollen-Item
        if (item.type === 'role') {
            const roleId = itemRoles[item.name.toLowerCase()];
            const role = interaction.guild.roles.cache.get(roleId);

            if (!role) {
                return interaction.reply({ content: '❌ Rolle nicht gefunden.', flags: 64 });
            }

            if (member.roles.cache.has(roleId)) {
                resultText = `⚠️ Du hast die Rolle **${role.name}** bereits. Das Item wurde trotzdem verbraucht.`;
            } else {
                await member.roles.add(roleId).catch(() => {});
                resultText = `✅ Du hast die Rolle **${role.name}** erhalten!`;
            }
        }

        const embed = new EmbedBuilder()
            .setTitle('🎮 Item benutzt')
            .setDescription(resultText)
            .setColor(0x9B59B6)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
