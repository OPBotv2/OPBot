require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const log = require('./utils/log');
const setupDatabase = require('./database/setup');
const { loadButtons } = require('./handlers/buttonHandler');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8085;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commands = [];
const commandFolders = fs.readdirSync('./commands');

log.init(client);

setupDatabase();
loadButtons();
app.use(express.json());

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

app.post('/github-webhook', (req, res) => {
    const payload = req.body;
    const event = req.headers['x-github-event'];

    if (event === 'push') {
        const commits = payload.commits.map(commit => `[\`${commit.id.substring(0, 7)}\`](${commit.url}) ${commit.message} – *${commit.author.name}*`).join('\n');
        const message = `📢 **Neuer Push in ${payload.repository.full_name}**\n${commits}`;
        sendMessageToDiscordChannel(message);
    }
    // Weitere Ereignisse wie 'issues' oder 'pull_request' können hier verarbeitet werden

    res.status(200).send('Webhook empfangen');
});

// sendMessage
function sendMessageToDiscordChannel(message) {
    const channel = client.channels.cache.get('1301629741576753204');
    if (channel) {
        channel.send(message);
    } else {
        console.error('Kanal nicht gefunden');
    }
}

app.listen(PORT, () => {
    console.log(`Webhook-Listener läuft auf Port ${PORT}`);
});

// Interaktionen laden
const interactionHandler = require('./interaction/interactioncreate');
client.on('interactionCreate', interaction => interactionHandler(interaction, client));

client.login(process.env.TOKEN);