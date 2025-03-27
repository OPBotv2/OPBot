require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const log = require('./utils/log');
const setupDatabase = require('./database/setup');
const { loadButtons } = require('./handlers/buttonHandler');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commands = [];
const commandFolders = fs.readdirSync('./commands');

log.init(client);

setupDatabase();
loadButtons();

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        }
    }
}

// Slash-Commands registrieren
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
(async () => {
    try {
        log.info('🔄 Slash-Commands werden registriert...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        log.info('✅ Slash-Commands registriert.');
    } catch (error) {
        log.error(error)
    }
})();

// Events laden
const eventFolders = fs.readdirSync('./events');
for (const folder of eventFolders) {
    const eventFiles = fs.readdirSync(`./events/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`./events/${folder}/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
}

// Interaktionen laden
const interactionHandler = require('./interaction/interactioncreate');
client.on('interactionCreate', interaction => interactionHandler(interaction, client));

client.login(process.env.TOKEN);