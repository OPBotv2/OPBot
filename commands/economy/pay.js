const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const economy = require('../../database/economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Sende Coins an einen anderen Benutzer')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Empfänger')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Betrag in Coins')
                .setRequired(true)),

    async execute(interaction) {
        const senderId = interaction.user.id;
        const receiver = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        if (receiver.bot) {
            return interaction.reply({ content: '❌ Du kannst Bots kein Geld senden.', flags: 64 });
        }

        if (receiver.id === senderId) {
            return interaction.reply({ content: '❌ Du kannst dir selbst kein Geld senden.', flags: 64 });
        }

        if (amount <= 0) {
            return interaction.reply({ content: '❌ Betrag muss größer als 0 sein.', flags: 64 });
        }

        const balance = await economy.getBalance(senderId);
        if (balance < amount) {
            return interaction.reply({ content: `❌ Du hast nur ${balance.toLocaleString()} Coins.`, flags: 64 });
        }

        // Transaktion
        await economy.addMoney(senderId, -amount);
        await economy.addMoney(receiver.id, amount);

        const embed = new EmbedBuilder()
            .setTitle('💸 Zahlung erfolgreich')
            .setDescription(`Du hast <@${receiver.id}> **${amount.toLocaleString()}** Coins gesendet.`)
            .setColor(0x1ABC9C)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        try {
            await receiver.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('📥 Zahlung erhalten')
                        .setDescription(`Du hast **${amount.toLocaleString()}** Coins von **${interaction.user.tag}** erhalten.`)
                        .setColor(0x2ECC71)
                        .setTimestamp()
                ]
            });
        } catch {
            // DM fehlgeschlagen – still okay
        }
    }
};
