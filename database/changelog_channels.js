const db = require('./mysql');

module.exports = {
    async setChangelogChannel(guildId, channelId) {
        await db.query(`
            INSERT INTO changelog_channels (guild_id, channel_id)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE channel_id = VALUES(channel_id)
        `, [guildId, channelId]);
    },

    async getChangelogChannel(guildId) {
        const [rows] = await db.query(`
            SELECT channel_id FROM changelog_channels WHERE guild_id = ?
        `, [guildId]);
        return rows[0]?.channel_id || null;
    }
};
