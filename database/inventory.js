const db = require('./mysql');

module.exports = {
    async getShopItems() {
        const [rows] = await db.query('SELECT * FROM items');
        return rows;
    },

    async getUserInventory(userId) {
        const [rows] = await db.query(`
            SELECT i.name, inv.quantity
            FROM inventory inv
            JOIN items i ON i.id = inv.item_id
            WHERE inv.user_id = ?`, [userId]);
        return rows;
    },

    async getItemByName(name) {
        const [rows] = await db.query('SELECT * FROM items WHERE name = ?', [name]);
        return rows[0];
    },

    async buyItem(userId, itemId) {
        const [rows] = await db.query('SELECT quantity FROM inventory WHERE user_id = ? AND item_id = ?', [userId, itemId]);

        if (rows.length === 0) {
            await db.query('INSERT INTO inventory (user_id, item_id, quantity) VALUES (?, ?, 1)', [userId, itemId]);
        } else {
            await db.query('UPDATE inventory SET quantity = quantity + 1 WHERE user_id = ? AND item_id = ?', [userId, itemId]);
        }
    },
    
    async getItemByName(name) {
        const [rows] = await db.query('SELECT * FROM items WHERE name = ?', [name]);
        return rows[0];
    },

    async getRandomReward() {
        const [rows] = await db.query('SELECT * FROM items WHERE type = "consumable" ORDER BY RAND() LIMIT 1');
        return rows[0];
    }
};
