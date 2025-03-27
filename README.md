## 📦 README.md

```md
# OPBot – Discord Utility & Economy Bot

Ein funktionsreicher Discord-Bot mit moderner SlashCommand-Struktur, Economy-System, Teamfunktionen, Changelogs, Datenbankunterstützung und mehr.

![Discord.js](https://img.shields.io/badge/discord.js-v14-blue?logo=discord)
![MySQL](https://img.shields.io/badge/database-MySQL-orange?logo=mysql)
![Node.js](https://img.shields.io/badge/node-%3E=18-green?logo=node.js)

---

## ✨ Features

- **Automatisches Laden von SlashCommands**:Der Bot erkennt und lädt automatisch alle verfügbaren Slash-Commands beim Start
- **Economy-System** mit `/pay`, `/top`, `/balance`, `/daily`, `/shop`, `/use`
- **Inventar- & Item-Management** (MySQL-basiert)
- **Changelog-System**:
  - `/changelogadd` →Speichert Changelogs in der Datenbank und postet sie im Foru
  - `/changelog` →Zeigt aktuelle & frühere Versionen mit Dropdow
  -Automatischer Discord-Post in Forum/Textkana
- **Admin-Commands** wie `/reload`, `/changelogremove`
- **Multi-Handler-System**:
  -Auto-Loader für Commands, Events, Buttons, Select
- **MySQL-Unterstützung** (inkl. automatischer Tabellenerstellung)
- **Mehrsprachigkeit**, **Logging**, **Permission-Checks**

---

## ⚙️ Installation

```bash
git clone https://github.com/DEIN-NAME/OPBot.git
cd OPBot
npm install
```

---

## 🧪 Einrichtung

### 1. `.env` erstellen

```env
TOKEN=dein-discord-bot-token
CLIENT_ID=deine-client-id
GUILD_ID=deine-test-guild-id

LOG_CHANNEL_ID=123456789012345678
CHANGELOG_CHANNEL_ID=123456789012345678
CHANGELOG_ANNOUNCE_CHANNEL_ID=123456789012345678

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=opbot
```

### 2. Start

```bash
node .
```

Der Bot lädt beim Start automatisch alle verfügbaren Slash-Commands und registriert sie bei Discor.

---

## 🗃️ Datenban

Der Bot nutzt automatisch MySQL/MariaDB und erstellt bei Start alle benötigten Tabelln:

- `users`– für Economy-Balace
- `items`– Shop-Itms
- `inventory`– Besitz pro Uer
- `transactions`– Verluf
- `changelogs`– alle Versions-Eintrge

---

## 🖼️ Screenshots

*(optional: Hier könntest du GIFs oder Bilder von `/shop`, `/help`, `/changelog` etc. zeigen)*

---

## 🤝 Lizenz

MIT – frei zur Nutzung & Anpassung.

---

## 👥 Credis

- Built with [discord.js](https://discord.j.org
- MySQL powered by [mysql2](https://www.npmjs.com/package/msql2
- Logging by [chalk](https://www.npmjs.com/package/halk)

---

> Fragen? Bugs? Pull Requests sind willkommen!

```