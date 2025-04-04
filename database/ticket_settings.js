const db = require('./mysql');

async function getTicketSettings(guildId) {
  const [rows] = await db.query('SELECT * FROM ticket_settings WHERE guild_id = ?', [guildId]);
  return rows[0] || null;
}

async function saveTicketSettings(guildId, options) {
  const {
    ticket_channel,
    allow_close_by_creator,
    auto_delete_after_close,
    default_role
  } = options;

  const sql = `
    INSERT INTO ticket_settings (guild_id, ticket_channel, allow_close_by_creator, auto_delete_after_close, default_role)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      ticket_channel = VALUES(ticket_channel),
      allow_close_by_creator = VALUES(allow_close_by_creator),
      auto_delete_after_close = VALUES(auto_delete_after_close),
      default_role = VALUES(default_role)
  `;

  await db.query(sql, [guildId, ticket_channel, allow_close_by_creator, auto_delete_after_close, default_role]);
}

module.exports = {
  getTicketSettings,
  saveTicketSettings
};
