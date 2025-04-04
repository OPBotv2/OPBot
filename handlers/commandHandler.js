const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  client.commands = new Map();

  const commandsPath = path.join(__dirname, '..', 'commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
      console.log(`✅ Slash-Command geladen: ${command.data.name}`);
    } else {
      console.warn(`⚠️ Ungültiger Command in Datei ${file}`);
    }
  }
};