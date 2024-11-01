const { REST, Routes } = require('discord.js');
const fs = require('fs');
const config = require('./config.json');

const commands = [];
const premiumFiles = fs.readdirSync('./premium').filter(file => file.endsWith('.js'));
// Premium Commands laden
for (const file of premiumFiles) {
    const premiumCommand = require(`./premium/${file}`);
    commands.push(premiumCommand.data.toJSON());
  }

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
  try {
    console.log('Slash-Commands werden registriert...');

    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands }
    );

    console.log('Slash-Commands erfolgreich registriert!');
  } catch (error) {
    console.error(error);
  }
})();
