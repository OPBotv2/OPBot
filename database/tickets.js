const db = require('./mysql'); // z. B. mysql2 Verbindung

async function createTicket({ guildId, userId, channelId, category, status = 'offen', createdAt = new Date() }) {
  const sql = 'INSERT INTO tickets (guild_id, user_id, channel_id, category, status, created_at) VALUES (?, ?, ?, ?, ?, ?)';
  await db.query(sql, [guildId, userId, channelId, category, status, createdAt]);
}

async function getAllTickets(guildId) {
  const sql = 'SELECT * FROM tickets WHERE guild_id = ? ORDER BY created_at DESC';
  const [rows] = await db.query(sql, [guildId]);
  return rows;
}

async function getTicketByChannelId(channelId) {
  const sql = 'SELECT * FROM tickets WHERE channel_id = ?';
  const [rows] = await db.query(sql, [channelId]);
  return rows[0];
}

async function closeTicket(channelId, guildId) {
  const sql = 'UPDATE tickets SET status = ? WHERE channel_id = ? AND guild_id = ?';
  await db.query(sql, ['geschlossen', channelId, guildId]);
}

module.exports = {
  createTicket,
  getAllTickets,
  getTicketByChannelId,
  closeTicket
};
