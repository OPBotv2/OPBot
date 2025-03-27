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
            const relativePath = path.relative(path.join(__dirname, '..', 'buttons'), fullPath);
            const customId = relativePath.replace(/\\/g, '/').replace(/\.js$/, '');

            try {
                const handler = require(fullPath);
                buttons.set(customId, handler);
            } catch (err) {
                console.warn(`❌ Fehler beim Laden von Button ${customId}:`, err);
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
