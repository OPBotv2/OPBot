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
          version VARCHAR(20) NOT NULL,
          date DATE NOT NULL,
          entries TEXT NOT NULL,
          guild_id VARCHAR(32) NOT NULL,
          UNIQUE KEY version_guild (version, guild_id)
        )
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS changelog_channels (
            guild_id VARCHAR(32) PRIMARY KEY,
            channel_id VARCHAR(32) NOT NULL
        )
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS guild_settings (
          guild_id VARCHAR(32) NOT NULL,
          setting_key VARCHAR(64) NOT NULL,
          setting_value TEXT,
          PRIMARY KEY (guild_id, setting_key)
        )
    `);
    
    await db.query(`
        CREATE TABLE IF NOT EXISTS tickets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            guild_id VARCHAR(32) NOT NULL,
            user_id VARCHAR(32) NOT NULL,
            channel_id VARCHAR(32) NOT NULL,
            category VARCHAR(50),
            status VARCHAR(20) DEFAULT 'offen',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);    

    await db.query(`
        CREATE TABLE IF NOT EXISTS ticket_settings (
            guild_id VARCHAR(32) PRIMARY KEY,
            ticket_channel VARCHAR(32),
            allow_close_by_creator BOOLEAN DEFAULT true,
            auto_delete_after_close BOOLEAN DEFAULT true,
            default_role VARCHAR(32)
        )
    `);    

    log.info('✅ Datenbanktabellen wurden überprüft/erstellt.');
    await log.discord(`✅ Datenbanktabellen wurden überprüft/erstellt.`, 'info');
};
