const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const colors = require('colors'); // Damit wir Farben in der Konsole verwenden können
const config = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();

// Commands laden
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Events laden
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// Bot-Startmeldung
client.once('ready', () => {
  console.log(`[`.gray + `OPBot`.blue + `]`.gray + ` Bot gestartet`.green);
  console.log();
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
  
    const command = client.commands.get(interaction.commandName);
  
    if (!command) return;
  
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Es gab ein Problem beim Ausführen dieses Befehls.', ephemeral: true });
    }
});

client.login(config.token);
