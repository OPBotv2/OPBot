// web/routes/dashboard.js
const express = require('express');
const router = express.Router();
const { getGuildSettings } = require('../../database/guild_settings');
const { getAllChangelogs } = require('../../database/changelogs');
const { getAllTickets } = require('../../database/tickets');
const { getTicketSettings, saveTicketSettings } = require('../../database/ticket_settings');

// Dashboard-Startseite: Alle Guilds anzeigen, in denen der Bot ist
router.get('/', async (req, res) => {
  const userGuilds = req.user.guilds || [];

  const enrichedGuilds = userGuilds
  .filter(guild => (guild.permissions & 0x00000008) === 0x00000008) // Nur Admins
  .map(guild => {
    const botInGuild = req.app.locals.client?.guilds?.cache?.has(guild.id) || false;
    const iconURL = guild.icon
      ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
      : 'https://cdn.discordapp.com/embed/avatars/1.png';

    return {
      ...guild,
      botInGuild,
      iconURL,
      isAdmin: true // explizit setzen für das Template
    };
  });

  res.render('dashboard/index', {
    user: req.user,
    guilds: enrichedGuilds,
    clientId: process.env.CLIENT_ID
  });
});

// Einstellungen & Changelogs für eine Guild anzeigen
router.get('/:guildId', async (req, res) => {
  const guildId = req.params.guildId;
  const settings = await getGuildSettings(guildId);
  const changelogs = await getAllChangelogs(guildId);

  // Guild aus dem Client holen
  const guild = req.app.locals.client?.guilds?.cache?.get(guildId);

  res.render('dashboard/guild', {
    user: req.user,
    guildId,
    guildName: guild?.name || 'Unbekannter Server',
    settings,
    changelogs,
    message: settings ? null : 'Keine Einstellungen gefunden.'
  });
});

router.get('/commands', (req, res) => {
  const commands = req.app.locals.client?.commands?.map(cmd => ({
    name: cmd.name,
    description: cmd.description
  })) || [];

  res.render('dashboard/commands', {
    user: req.user,
    commands
  });
});

router.get('/:guildId/tickets', async (req, res) => {
  const guildId = req.params.guildId;
  const guild = req.app.locals.client.guilds.cache.get(guildId);

  if (!guild) {
    return res.status(404).send('Guild nicht gefunden oder Bot ist nicht auf dem Server.');
  }

  const tickets = await getAllTickets(guildId);

  res.render('dashboard/tickets', {
    user: req.user,
    guild,
    tickets
  });
});

// Ticket-Settings Seite (Formular anzeigen)
router.get('/:guildId/settings/tickets', async (req, res) => {
  const guildId = req.params.guildId;
  const guild = req.app.locals.client.guilds.cache.get(guildId);

  if (!guild) return res.status(404).send('Guild nicht gefunden');

  const settings = await getTicketSettings(guildId) || {};

  res.render('dashboard/tickets_settings', {
    user: req.user,
    guild,
    settings
  });
});

// Ticket-Settings speichern (Formular POST)
router.post('/:guildId/settings/tickets', async (req, res) => {
  const guildId = req.params.guildId;
  const { ticket_channel, allow_close_by_creator, auto_delete_after_close, default_role } = req.body;

  await saveTicketSettings(guildId, {
    ticket_channel,
    allow_close_by_creator: allow_close_by_creator === 'on',
    auto_delete_after_close: auto_delete_after_close === 'on',
    default_role
  });

  res.redirect(`/dashboard/${guildId}/settings/tickets`);
});

module.exports = router;
