// web/routes/dashboard.js
const express = require('express');
const router = express.Router();
const { getGuildSettings } = require('../../database/guild_settings');
const { getAllChangelogs } = require('../../database/changelogs');

// Dashboard-Startseite: Alle Guilds anzeigen, in denen der Bot ist
router.get('/', async (req, res) => {
  const userGuilds = req.user.guilds || [];

  const enrichedGuilds = userGuilds.map(guild => {
    const botInGuild = req.app.locals.client?.guilds?.cache?.has(guild.id) || false;
    const iconURL = guild.icon
      ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
      : 'https://cdn.discordapp.com/embed/avatars/1.png';

    return {
      ...guild,
      botInGuild,
      iconURL
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

  res.render('dashboard/guild', {
    user: req.user,
    guildId,
    settings,
    changelogs,
    message: settings ? null : 'Keine Einstellungen gefunden.'
  });
});

module.exports = router;
