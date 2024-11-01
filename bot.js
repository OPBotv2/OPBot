const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
const colors = require('colors'); // Für farbige Konsolenausgabe

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
client.commands = new Collection();

// Commands laden und in ein Array für die Registrierung packen
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

async function loadPremiumCommands(client, member) {
    console.log(`Prüfe Premium-Berechtigungen für ${member.user.tag}`);
    if (member.guild.id === config.guildId && member.roles.cache.has(config.premiumRoleId)) {
      console.log(`${member.user.tag} hat die Premium-Rolle und befindet sich in der richtigen Guild. Lade Premium-Commands...`);
  
      const premiumFiles = fs.readdirSync('./premium').filter(file => file.endsWith('.js'));
      const premiumCommands = [];
      for (const file of premiumFiles) {
        const premiumCommand = require(`./premium/${file}`);
        client.commands.set(premiumCommand.data.name, premiumCommand);
        premiumCommands.push(premiumCommand.data.toJSON());
        console.log(`Premium-Command geladen: ${premiumCommand.data.name}`);
      }
  
      console.log(`Insgesamt ${premiumFiles.length} Premium-Commands geladen.`);
  
      // Premium-Commands bei Discord registrieren
      const rest = new REST({ version: '10' }).setToken(config.token);
      try {
        console.log('Registriere Premium-Slash-Commands bei Discord...');
        await rest.put(
          Routes.applicationGuildCommands(config.clientId, config.guildId),
          { body: premiumCommands }
        );
        console.log('Premium-Slash-Commands erfolgreich bei Discord registriert!');
      } catch (error) {
        console.error('Fehler bei der Registrierung der Premium-Slash-Commands:', error);
      }
    } else {
      console.log(`${member.user.tag} hat entweder nicht die Premium-Rolle oder befindet sich nicht in der richtigen Guild.`);
    }
  }
  

  client.on('ready', async () => {
    console.log(`Bot gestartet als ${client.user.tag}`);
  
    // Teste das Laden der Premium-Commands direkt
    const guild = client.guilds.cache.get(config.guildId);
    const member = await guild.members.fetch(config.clientId); // Falls der Bot-User selbst eine Premium-Rolle haben soll
    await loadPremiumCommands(client, member);
  });
  

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
  
    const command = client.commands.get(interaction.commandName);
    if (!command) {
      console.log(`Command ${interaction.commandName} nicht gefunden.`);
      return;
    }
  
    // Überprüfen, ob der Benutzer die Premium-Rolle hat und die Premium-Commands geladen sind
    const member = await interaction.guild.members.fetch(interaction.user.id);
    console.log(`Überprüfe Premium-Rolle für ${member.user.tag}`);
  
    if (member.roles.cache.has(config.premiumRoleId)) {
      console.log(`${member.user.tag} hat die Premium-Rolle. Lade Premium-Commands falls nötig...`);
      if (!client.commands.has('premiumfeature')) {
        await loadPremiumCommands(client, member);
      }
    } else {
      console.log(`${member.user.tag} hat nicht die Premium-Rolle.`);
    }
  
    // Command ausführen
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Fehler beim Ausführen des Commands ${interaction.commandName}:`, error);
      await interaction.reply({ content: 'Es gab ein Problem beim Ausführen dieses Befehls.', ephemeral: true });
    }
  });
  
  

// Bot-Login
client.login(config.token);
