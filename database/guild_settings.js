const db = require('./mysql');

// Hole alle Einstellungen für eine Guild
async function getGuildSettings(guildId) {
  const [rows] = await db.query(
    'SELECT setting_key, setting_value FROM guild_settings WHERE guild_id = ?',
    [guildId]
  );

  if (!rows.length) return null;

  const settings = {};
  for (const row of rows) {
    // Versuche JSON zu parsen, sonst als String behalten
    try {
      settings[row.setting_key] = JSON.parse(row.setting_value);
    } catch {
      settings[row.setting_key] = row.setting_value;
    }
  }

  return settings;
}

// Speichere/aktualisiere eine Einstellung
async function setGuildSetting(guildId, key, value) {
  const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);

  await db.query(`
    INSERT INTO guild_settings (guild_id, setting_key, setting_value)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
  `, [guildId, key, jsonValue]);
}

module.exports = {
  getGuildSettings,
  setGuildSetting
};
