module.exports = {
    name: 'messageCreate',
    execute(message, client) {
      if (!message.content.startsWith(config.prefix) || message.author.bot) return;
  
      const args = message.content.slice(config.prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = client.commands.get(commandName);
  
      if (!command) return;
  
      try {
        command.execute(message, args);
      } catch (error) {
        console.error(error);
        message.reply('Es gab ein Problem beim Ausführen dieses Befehls.');
      }
    },
  };
  