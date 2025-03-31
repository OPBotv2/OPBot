const express = require('express');
const router = express.Router();
const { setGuildSetting } = require('../../../database/guild_settings');

router.post('/:guildId', async (req, res) => {
  const guildId = req.params.guildId;
  const { prefix, changelog_channel_id, economy_enabled, is_premium } = req.body;

  try {
    await setGuildSetting(guildId, 'prefix', prefix || '!');
    await setGuildSetting(guildId, 'changelog_channel_id', changelog_channel_id || null);
    await setGuildSetting(guildId, 'economy_enabled', economy_enabled === 'on');
    await setGuildSetting(guildId, 'is_premium', is_premium === 'on');

    res.redirect(`/dashboard/${guildId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Fehler beim Speichern');
  }
});

module.exports = router;
