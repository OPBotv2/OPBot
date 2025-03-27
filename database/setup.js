const db = require('./mysql');
const log = require('../utils/log');

module.exports = async function setupDatabase() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS users (
            user_id VARCHAR(32) PRIMARY KEY,
            balance BIGINT DEFAULT 0,
            last_daily BIGINT DEFAULT 0
        )
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) UNIQUE NOT NULL,
            price INT NOT NULL,
            type VARCHAR(20) DEFAULT 'consumable'
        )
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS inventory (
            user_id VARCHAR(32),
            item_id INT,
            quantity INT DEFAULT 1,
            PRIMARY KEY (user_id, item_id),
            FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
        )
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(32) NOT NULL,
            type VARCHAR(20),
            details TEXT,
            timestamp BIGINT
        )
    `);
    
    await db.query(`
        CREATE TABLE IF NOT EXISTS changelogs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            version VARCHAR(20) NOT NULL UNIQUE,
            date DATE NOT NULL,
            entries TEXT NOT NULL
        )
    `);

    log.info('✅ Datenbanktabellen wurden überprüft/erstellt.');
    log.discord(`✅ Datenbanktabellen wurden überprüft/erstellt.`, 'info');
};
