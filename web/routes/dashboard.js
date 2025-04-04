// web/routes/dashboard.js
const express = require('express');
const router = express.Router();
const { getGuildSettings } = require('../../database/guild_settings');
const { getAllChangelogs } = require('../../database/changelogs');

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

module.exports = router;
