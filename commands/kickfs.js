const talkedRecently = new Set();
const commandDelay = 2.5 //seconds 

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'kickfs',
  description: 'Kick a user off of the server with a reason.',
  execute(message, args, client){
    if (talkedRecently.has(message.author.id)) {
      message.channel.send("Please wait " + commandDelay + " second(s) until you can use this command again");
    } else {
      if (!message.guild.members.cache.get(message.author.id).roles.cache.some(role => role.name === 'ModPerms')) return message.reply("You do not have the permission to do this command!")
      const member = message.mentions.members.first();
      if (!member) return message.reply("Please specify a member!")
      
      if (!member.kickable) return message.reply("You cannot kick this user!")

      
      args.shift()
      args.shift()
      const reason = args.join(" ")
      if (reason == "") {
        member.send("You have been kicked from `" + message.guild.name + "`.\nNo reason given by moderator.") .then(() => {
          message.reply("Successfully kicked " + member.user.tag + ".\nReason given: ```" + reason + "```")
        }) .catch((err) => {
          message.reply("Kicked successfully! However, The message was not delivered to the user.")
        })
      } else {
        member.send("You have been kicked from `" + message.guild.name + "`.\nReason from moderator: " + reason) .then(() => {
          message.reply("Successfully kicked " + member.user.tag + ".")
        }) .catch((err) => {
          message.reply("Kicked successfully! However, The message was not delivered to the user.")
        })
      }
      
      setTimeout(() => {
        member.kick(reason)
      }, 100);
      
      talkedRecently.add(message.author.id);
      setTimeout(() => {
        // Removes the user from the set after a minute
        talkedRecently.delete(message.author.id);
      }, commandDelay * 1000);
    }
  }
}