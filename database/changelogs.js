const db = require('./mysql'); // deine bestehende DB-Verbindung

async function saveChangelogToDB(version, date, entriesArray, guildId) {
    const entries = entriesArray.join('\n'); // schöner Formatblock

    try {
        await db.query(
            'INSERT INTO changelogs (version, date, entries, guild_id) VALUES (?, ?, ?)',
            [version, date, entries, guildId]
        );
        return true;
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            console.warn(`⚠️ Version ${version} existiert bereits in der Datenbank.`);
        } else {
            console.error('❌ Fehler beim Speichern des Changelogs in die DB:', err);
        }
        return false;
    }
}

async function deleteChangelogFromDB(version) {
    try {
        const [result] = await db.query(
            'DELETE FROM changelogs WHERE version = ?',
            [version]
        );
        return result.affectedRows > 0;
    } catch (err) {
        console.error('❌ Fehler beim Löschen aus der DB:', err);
        return false;
    }
}

async function getAllChangelogs(guildId) {
    try {
        const [rows] = await db.query(
            'SELECT version, date, entries FROM changelogs WHERE guild_id = ? ORDER BY id DESC',
            [guildId]
        );

        return rows.map(row => ({
            version: row.version,
            date: row.date,
            entries: row.entries.split('\n')
        }));
    } catch (err) {
        console.error('❌ Fehler beim Laden der Changelogs aus der DB:', err);
        return [];
    }
}

async function getChangelogByVersion(version, guildId) {
    try {
        const [rows] = await db.query(
            'SELECT * FROM changelogs WHERE version = ? AND guild_id = ? LIMIT 1',
            [version, guildId]
        );

        if (rows.length === 0) return null;

        return {
            version: rows[0].version,
            date: rows[0].date,
            entries: rows[0].entries.split('\n')
        };
    } catch (err) {
        console.error('❌ Fehler beim Suchen des Changelogs:', err);
        return null;
    }
}

module.exports = {
    saveChangelogToDB,
    deleteChangelogFromDB,
    getAllChangelogs,
    getChangelogByVersion
};
