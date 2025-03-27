const db = require('./mysql');

module.exports = {
    async getBalance(userId) {
        const [rows] = await db.query('SELECT balance FROM users WHERE user_id = ?', [userId]);
        return rows[0]?.balance ?? 0;
    },

    async addMoney(userId, amount) {
        const balance = await this.getBalance(userId);
        if (balance === 0) {
            await db.query('INSERT INTO users (user_id, balance) VALUES (?, ?)', [userId, amount]);
        } else {
            await db.query('UPDATE users SET balance = balance + ? WHERE user_id = ?', [amount, userId]);
        }
    },

    async getLastDaily(userId) {
        const [rows] = await db.query('SELECT last_daily FROM users WHERE user_id = ?', [userId]);
        return rows[0]?.last_daily ?? 0;
    },

    async setLastDaily(userId, timestamp) {
        await db.query('UPDATE users SET last_daily = ? WHERE user_id = ?', [timestamp, userId]);
    },

    async getTopUsers(limit = 10) {
        const [rows] = await db.query('SELECT user_id, balance FROM users ORDER BY balance DESC LIMIT ?', [limit]);
        return rows;
    }
};
