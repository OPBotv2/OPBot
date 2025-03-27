const db = require('./mysql');

module.exports = {
    async log(type, userId, details) {
        await db.query(
            'INSERT INTO transactions (user_id, type, details, timestamp) VALUES (?, ?, ?, ?)',
            [userId, type, details, Date.now()]
        );
    },

    async getLogs(userId, limit = 10) {
        const [rows] = await db.query(
            'SELECT * FROM transactions WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?',
            [userId, limit]
        );
        return rows;
    }
};
