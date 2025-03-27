# OPBot – Dein vielseitiger Discord-Bot

OPBot ist ein funktionsreicher Discord-Bot mit moderner SlashCommand-Struktur, Economy-System, Teamfunktionen, Changelog-Management, Datenbankunterstützung und vielem mehr.

![Discord.js](https://img.shields.io/badge/discord.js-v14-blue?logo=discord)
![MySQL](https://img.shields.io/badge/database-MySQL-orange?logo=mysql)
![Node.js](https://img.shields.io/badge/node-%3E=18-green?logo=node.js)

## Inhaltsverzeichnis

- [Features](#features)
- [Voraussetzungen](#voraussetzungen)
- [Installation](#installation)
- [Einrichtung](#einrichtung)
- [Verwendung](#verwendung)
- [Datenbankstruktur](#datenbankstruktur)
- [Beitragen](#beitragen)
- [Lizenz](#lizenz)
- [Credits](#credits)

## Features

- **Automatisches Laden von SlashCommands**: Der Bot erkennt und lädt beim Start automatisch alle verfügbaren Slash-Commands.
- **Economy-System**: Verwende Befehle wie `/pay`, `/top`, `/balance`, `/daily`, `/shop` und `/use`, um das Economy-System zu nutzen.
- **Inventar- & Item-Management**: Verwaltung von Benutzerinventaren und Shop-Artikeln, unterstützt durch MySQL.
- **Changelog-System**:
  - `/changelogadd`: Speichert Changelogs in der Datenbank und postet sie im Forum.
  - `/changelog`: Zeigt aktuelle und frühere Versionen mit Dropdown-Menü an.
  - Automatischer Discord-Post in Forum oder Textkanal.
- **Admin-Commands**: Verwaltung des Bots mit Befehlen wie `/reload` und `/changelogremove`.
- **Multi-Handler-System**: Automatisches Laden von Commands, Events, Buttons und Selects.
- **MySQL-Unterstützung**: Automatische Erstellung der benötigten Tabellen bei Start.
- **Mehrsprachigkeit**, **Logging**, **Permission-Checks** und vieles mehr.

## Voraussetzungen

- **Node.js**: Version 18 oder höher.
- **NPM**: Node Package Manager, wird mit Node.js installiert.
- **MySQL**: Für die Datenbankunterstützung.

## Installation

1. **Repository klonen**:

   ```bash
   git clone https://github.com/DEIN-NAME/OPBot.git
   cd OPBot
   ```

2. **Abhängigkeiten installieren**:

   ```bash
   npm install
   ```

## Einrichtung

1. **`.env`-Datei erstellen**: Erstelle eine `.env`-Datei im Hauptverzeichnis und füge folgende Inhalte hinzu:

   ```env
   TOKEN=dein-discord-bot-token
   CLIENT_ID=deine-client-id
   GUILD_ID=deine-test-guild-id

   LOG_CHANNEL_ID=123456789012345678
   CHANGELOG_CHANNEL_ID=123456789012345678
   CHANGELOG_ANNOUNCE_CHANNEL_ID=123456789012345678

   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=dein-passwort
   DB_NAME=opbot
   ```

   Stelle sicher, dass du die Platzhalter durch deine tatsächlichen Werte ersetzt.

2. **Bot starten**:

   ```bash
   node .
   ```

   Der Bot registriert beim Start automatisch alle verfügbaren Slash-Commands bei Discord.

## Verwendung

Nach erfolgreicher Installation und Einrichtung kannst du den Bot in deinem Discord-Server nutzen. Verwende Slash-Commands wie `/help`, um eine Liste aller verfügbaren Befehle zu erhalten.

## Datenbankstruktur

Der Bot verwendet MySQL/MariaDB und erstellt bei Start automatisch die folgenden Tabellen:

- `users`: Speichert Informationen über Benutzer und deren Economy-Balance.
- `items`: Enthält die verfügbaren Shop-Artikel.
- `inventory`: Verwaltet den Besitz der Benutzer.
- `transactions`: Protokolliert alle Transaktionen.
- `changelogs`: Speichert alle Versions-Einträge.

## Beitragen

Beiträge zum Projekt sind herzlich willkommen! Wenn du einen Fehler findest oder eine neue Funktion vorschlagen möchtest, eröffne bitte ein Issue. Für größere Änderungen erstelle bitte einen Fork des Repositories und reiche einen Pull Request ein.

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz – du kannst es frei nutzen und anpassen.

## Credits

- Erstellt mit [discord.js](https://discord.js.org).
- Datenbankunterstützung durch [mysql2](https://www.npmjs.com/package/mysql2).
- Logging mit [chalk](https://www.npmjs.com/package/chalk).