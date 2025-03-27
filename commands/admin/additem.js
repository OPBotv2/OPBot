const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../../database/mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('additem')
        .setDescription('Füge ein neues Item zum Shop hinzu')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Name des Items')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('preis')
                .setDescription('Preis in Coins')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const name = interaction.options.getString('name');
        const price = interaction.options.getInteger('preis');

        const [existing] = await db.query('SELECT * FROM items WHERE name = ?', [name]);
        if (existing.length > 0) {
            return interaction.reply({ content: '❌ Ein Item mit diesem Namen existiert bereits.', flags: 64 });
        }

        await db.query('INSERT INTO items (name, price) VALUES (?, ?)', [name, price]);

        const embed = new EmbedBuilder()
            .setTitle('✅ Item hinzugefügt')
            .addFields(
                { name: '🧩 Name', value: name, inline: true },
                { name: '💰 Preis', value: `${price}`, inline: true }
            )
            .setColor(0x2ECC71);

        await interaction.reply({ embeds: [embed] });
    }
};
