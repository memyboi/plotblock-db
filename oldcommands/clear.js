const talkedRecently = new Set();
const commandDelay = 0.1 //seconds 

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'clear',
  description: 'Delete the amount of messages you specify',
  execute(message, args, client){
    if (talkedRecently.has(message.author.id)) {
      message.channel.send("Please wait " + commandDelay + " second(s) until you can use this command again");
    } else {
      if (message.guild == null) return message.reply("You cannot do this command in DMs.");
      if (!message.guild.members.cache.get(message.author.id).roles.cache.some(role => role.name === 'ModPerms')) return message.reply("You do not have the permission to do this command!")
      const amnt = parseInt(args[1]) + 1 || 2
      message.channel.bulkDelete(amnt) .catch((err) => {
        if (err.code == 50035) {
          message.reply("This number is too big!")
        }
      })
      talkedRecently.add(message.author.id);
      setTimeout(() => {
        // Removes the user from the set after a minute
        talkedRecently.delete(message.author.id);
      }, commandDelay * 1000);
    }
  }
}