Gerne helfe ich dir dabei, die `README.md` für dein Projekt weiter zu optimieren. Hier ist eine überarbeitete Version, die auf bewährten Praktiken basiert und zusätzliche Abschnitte für eine verbesserte Benutzerführung enthält:

```md
# OPBot – Discord Utility & Economy Bot

Ein funktionsreicher Discord-Bot mit moderner SlashCommand-Struktur, Economy-System, Teamfunktionen, Changelogs, Datenbankunterstützung und mehr.

![Discord.js](https://img.shields.io/badge/discord.js-v14-blue?logo=discord)
![MySQL](https://img.shields.io/badge/database-MySQL-orange?logo=mysql)
![Node.js](https://img.shields.io/badge/node-%3E=18-green?logo=node.js)

---

## Inhaltsverzeichnis

- [Features](#-features)
- [Installation](#-installation)
- [Einrichtung](#-einrichtung)
- [Datenbank](#-datenbank)
- [Screenshots](#-screenshots)
- [Beitragende](#-beitragende)
- [Lizenz](#-lizenz)
- [Credits](#-credits)

---

## ✨ Features

- **Automatisches Laden von SlashCommands**: Der Bot erkennt und lädt automatisch alle verfügbaren Slash-Commands beim Start.
- **Economy-System** mit Befehlen wie `/pay`, `/top`, `/balance`, `/daily`, `/shop` und `/use`.
- **Inventar- & Item-Management**: Verwaltung von Benutzerinventaren und Shop-Artikeln, unterstützt durch MySQL.
- **Changelog-System**:
  - `/changelogadd`: Speichert Changelogs in der Datenbank und postet sie im Forum.
  - `/changelog`: Zeigt aktuelle und frühere Versionen mit Dropdown-Menü.
  - Automatischer Discord-Post in Forum oder Textkanal.
- **Admin-Commands** wie `/reload` und `/changelogremove`.
- **Multi-Handler-System**: Automatisches Laden von Commands, Events, Buttons und Selects.
- **MySQL-Unterstützung**: Automatische Erstellung der benötigten Tabellen bei Start.
- **Zusätzliche Funktionen**: Mehrsprachigkeit, Logging und Permission-Checks.

---

## ⚙️ Installation

1. **Repository klonen**:
   ```bash
   git clone https://github.com/DEIN-NAME/OPBot.git
   cd OPBot
   ```

2. **Abhängigkeiten installieren**:
   ```bash
   npm install
   ```

---

## 🧪 Einrichtung

1. **`.env`-Datei erstellen**:Kopiere die `.env.example`-Datei zu `.env` und fülle sie mit deinen spezifischen Werten aus

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

2. **Bot starten**:
   ```bash
   node .
   ```

   Der Bot lädt beim Start automatisch alle verfügbaren Slash-Commands und registriert sie bei Discord.

---

## 🗃️ Datenbank
Der Bot verwendet MySQL/MariaDB und erstellt bei Start automatisch die folgenden Tabelle:

- `users` Verwaltung der Economy-Balance der Benutze.
- `items` Speicherung von Shop-Artikel.
- `inventory` Zuordnung von Artikeln zu Benutzer.
- `transactions` Aufzeichnung von Transaktione.
- `changelogs` Speicherung aller Versionsänderunge.

---

## 🖼️ Screenshots

*Hier kannst du Screenshots oder GIFs von Bot-Funktionen wie `/shop`, `/help` oder `/changelog` einfügen, um Nutzern einen visuellen Eindruck zu vermitteln.*

---

## 🤝 Beitragene

Beiträge sind herzlich willkommen! Wenn du einen Fehler findest oder neue Funktionen vorschlagen möchtest, eröffne bitte ein Issue oder einen Pull Requst.

---

## 📄 Liznz

Dieses Projekt steht unter der MIT-Lizenz – Details findest du in der [LICENSE](./LICENSE)-Dtei.

---

## 👥 Credis

- Erstellt mit [discord.js](https://discord.jsorg)
- Datenbankanbindung durch [mysql2](https://www.npmjs.com/package/myql2)
- Logging realisiert mit [chalk](https://www.npmjs.com/package/calk).

--

> Bei Fragen oder Anregungen stehen wir gerne zur Verfgung!
```

**Änderungen und Verbesserungen:**

- **Inhaltsverzeichnis hinzugefüt**: Ermöglicht eine schnelle Navigation innerhalb der `READM.md`.
- **Abschnitt "Beitragende" eingefüt**: Ermutigt zur aktiven Beteiligung und erklärt den Prozess für Beiräge.
- **Klarere Struktur und Formatierug**: Verbessert die Lesbarkeit und Benutzerfürun.

Diese Überarbeitungen zielen darauf ab, die `README.md` informativer und einladender für potenzielle Nutzer und Mitwirkende zu gestlten. 