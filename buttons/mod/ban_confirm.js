const { EmbedBuilder } = require('discord.js');
const log = require('../../utils/log');

module.exports = async (interaction, client) => {
    const action = interaction.customId.split(':')[2]; // yes oder no

    const embed = interaction.message.embeds[0];
    const userId = embed?.fields?.[0]?.value.match(/\d{17,20}/)?.[0];
    const reason = embed?.fields?.[2]?.value || 'Kein Grund';

    const target = await interaction.guild.members.fetch(userId).catch(() => null);
    if (!target) {
        return interaction.update({ content: '❌ Benutzer nicht gefunden.', embeds: [], components: [], flags: 64 });
    }

    if (action === 'yes') {
        try {
            await target.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('🚫 Du wurdest gebannt')
                        .setDescription(`**Server:** ${interaction.guild.name}\n**Grund:** ${reason}`)
                        .setColor(0xED4245)
                        .setTimestamp()
                ]
            }).catch(() => console.warn(`⚠️ DM an ${target.user.tag} nicht möglich.`));

            await target.ban({ reason });

            const success = new EmbedBuilder()
                .setTitle('✅ Benutzer gebannt')
                .setColor(0xED4245)
                .addFields(
                    { name: '👤 Benutzer', value: `${target.user.tag} (${target.id})`, inline: true },
                    { name: '🛠️ Von', value: `${interaction.user.tag}`, inline: true },
                    { name: '📄 Grund', value: reason }
                )
                .setTimestamp();

            await interaction.update({ embeds: [success], components: [] });
            await log.discord(`🚫 **${target.user.tag}** wurde gebannt.`, 'warn');
        } catch (err) {
            log.error(err.message);
            await interaction.update({ content: '❌ Fehler beim Bannen.', embeds: [], components: [], flags: 64 });
        }
    } else {
        await interaction.update({ content: '❌ Bann abgebrochen.', embeds: [], components: [], flags: 64 });
    }
};
