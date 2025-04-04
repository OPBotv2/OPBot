const fs = require('fs');
const path = require('path');

const buttons = new Map();

function loadButtons(dir = path.join(__dirname, '..', 'buttons')) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            loadButtons(fullPath);
        } else if (file.endsWith('.js')) {
            try {
                const handler = require(fullPath);

                if (!handler.customId || typeof handler.execute !== 'function') {
                    console.warn(`⚠️  Button-Datei ${file} hat keinen gültigen customId oder execute.`);
                    continue;
                }

                buttons.set(handler.customId, handler);
                console.log(`✅ Button geladen: ${handler.customId}`);
            } catch (err) {
                console.warn(`❌ Fehler beim Laden von Button in ${file}:`, err);
            }
        }
    }
}

function getButtonHandler(customId) {
    return buttons.get(customId);
}

module.exports = {
    loadButtons,
    getButtonHandler
};
