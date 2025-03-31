const log = require('../../utils/log');
const { startWebServer } = require('../../web/server');
const web = require('../../web/server');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        log.info(`Eingeloggt als ${client.user.tag}`);
        await log.discord(`**${client.user.tag}** ist online.`, 'info');
        startWebServer(client);
        log.info('🌐 Webserver wird gestartet...');
        await log.discord(`🌐 Webserver wird gestartet...`, 'info');

        const activities = [
            () => `/balance tippen`,
            () => `/shop`,
            () => `${client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0)} Nutzer`,
            () => `💸 Wirtschaft läuft`,
            () => `${client.guilds.cache.size} Server`,
        ];

        let i = 0;
        setInterval(() => {
            const activity = activities[i % activities.length]();
            client.user.setActivity(activity, { type: 3 }); // 3 = WATCHING, 0 = PLAYING, 2 = LISTENING
            i++;
        }, 15_000); // alle 15 Sekunden wechseln

        // Optional: Startaktivität setzen
        client.user.setActivity(activities[0](), { type: 3 });
    }
};
