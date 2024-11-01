const { EmbedBuilder, ActivityType } = require('discord.js');
const config = require('../config.json');

// Funktion zum Entfernen von ANSI-Farbcodes und zur Konvertierung zu einer Zeichenkette
function removeAnsiCodes(text) {
  return String(text).replace(/\u001b\[[0-9;]*m/g, '');
}

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`[`.gray + `OPBot`.blue + `]`.gray + ` Bot gestartet`.green);
    setTimeout(() => {
        client.user.setPresence({
            activities: [{ name: 'Premium Features verfügbar', type: ActivityType.Watching }],
            status: 'dnd',
        });
        console.log('Aktivität gesetzt: Premium Features verfügbar');
    }, 5000); // 5 Sekunden Verzögerung
    


    // Kanal abrufen und Startmeldung senden
    const logChannel = client.channels.cache.get(config.logChannelId);
    if (logChannel) {
      const startEmbed = new EmbedBuilder()
        .setTitle('✅ Bot gestartet')
        .setDescription('Der Bot ist jetzt online und bereit für den Einsatz.')
        .setTimestamp();

      logChannel.send({ embeds: [startEmbed] });
    } else {
      console.error('Log-Kanal nicht gefunden. Überprüfe die Channel-ID in config.json.');
    }

    // Konsolen-Logs an den Discord-Kanal weiterleiten als Embeds ohne ANSI-Farbcodes
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      originalConsoleLog(...args); // Originale Konsolenausgabe beibehalten

      if (logChannel) {
        // Entferne ANSI-Farbcodes und konvertiere die Argumente zu Strings
        const cleanArgs = args.map(arg => removeAnsiCodes(arg));
        const logEmbed = new EmbedBuilder()
          .setTitle('📋 Log')
          .setDescription(cleanArgs.map(arg => `\`\`\`${arg}\`\`\``).join('\n'))
          .setTimestamp();

        logChannel.send({ embeds: [logEmbed] }).catch(err => {
          originalConsoleLog('Fehler beim Senden des Logs an Discord:', err);
        });
      }
    };
  },
};
