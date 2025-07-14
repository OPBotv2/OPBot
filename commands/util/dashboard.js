const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dashboard')
        .setDescription('Sendet dir den Link zum Web-Dashboard'),

    async execute(interaction) {
        const url = process.env.DASHBOARD_URL || 'http://localhost:3000';
        await interaction.reply({ content: `\uD83C\uDF10 Dashboard: ${url}`, ephemeral: true });
    }
};
