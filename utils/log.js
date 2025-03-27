const chalk = require('chalk');
const { EmbedBuilder } = require('discord.js');

function timestamp() {
    return new Date().toISOString().replace('T', ' ').split('.')[0];
}

let clientRef = null;

function format(type, msg) {
    const ts = chalk.gray(`[${timestamp()}]`);
    const types = {
        info: chalk.blue('[INFO]'),
        warn: chalk.yellow('[WARN]'),
        error: chalk.red('[ERROR]')
    };
    return `${ts} ${types[type] || '[LOG]'} ${msg}`;
}

module.exports = {
    init(client) {
        clientRef = client;
    },

    info(msg) {
        console.log(format('info', msg));
    },

    warn(msg) {
        console.warn(format('warn', msg));
    },

    error(msg) {
        console.error(format('error', msg));
    },

    async discord(message, type = 'info') {
        const logChannelId = process.env.LOG_CHANNEL_ID;
        if (!clientRef || !logChannelId) return;

        const channel = await clientRef.channels.fetch(logChannelId).catch(() => null);
        if (!channel || !channel.isTextBased()) return;

        const colors = {
            info: 0x3498DB,   // Blau
            warn: 0xF1C40F,   // Gelb
            error: 0xE74C3C   // Rot
        };

        const titles = {
            info: 'ℹ️ Info',
            warn: '⚠️ Warnung',
            error: '❌ Fehler'
        };

        const embed = new EmbedBuilder()
            .setTitle(titles[type] || '🔔 Log')
            .setDescription(message)
            .setColor(colors[type] || 0x95A5A6)
            .setTimestamp();

        await channel.send({ embeds: [embed] });
    }
};
