const talkedRecently = new Set();
const commandDelay = 2.5 //seconds 

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'kick',
  description: 'Kick a member off of your team if you are the leader.',
  execute(message, args, client){
    if (talkedRecently.has(message.author.id)) {
      message.channel.send("Please wait " + commandDelay + " second(s) until you can use this command again");
    } else {

    function sendLeaveMsg(member, roleName, roleEmoji) {
      const channel = client.channels.cache.find(channel => channel.name === "team-changes")
      channel.send("`" + member.user.tag + "` has been kicked out of `" + roleName + "` " + roleEmoji + " !")
    }
      
      //code lmao

      const member = message.mentions.members.first();
      if (!member) return message.reply("Please specify a member!")
      
      const res = message.member.roles.cache.some(role => role.name == "Team Diamond Leader");
      const res1 = message.member.roles.cache.some(role => role.name == "Team Pearl Leader");
      const res2 = message.member.roles.cache.some(role => role.name == "Team Platinum Leader");

      if(res) {
        //team diamond, has perms to kick
        let rolename = "Team Diamond"
        let roleemoji = process.env.diamondEmoji
        let roleteam = message.guild.roles.cache.find(role => role.name == rolename);
        let res3 = member.roles.cache.some(role => role.name == rolename);
        if (member.user.id == message.member.user.id) {
          message.reply("You can't kick yourself! do ?leave diamond to leave your team!")
        } else if (res3) {
          member.roles.remove(roleteam)
          message.reply("This person has now been kicked out of `" + rolename + "`!")
          sendLeaveMsg(member, rolename, roleemoji)
        } else {
          message.reply("This person isn't in `" + rolename + "`!")
        }
      } else if(res1) {
        //team pearl, has perms to kick
        let rolename = "Team Pearl"
        let roleemoji = process.env.pearlEmoji
        let roleteam = message.guild.roles.cache.find(role => role.name == rolename);
        let res3 = member.roles.cache.some(role => role.name == rolename);
        if (member.user.id == message.member.user.id) {
          message.reply("You can't kick yourself! do ?leave pearl to leave your team!")
        } else if (res3) {
          member.roles.remove(roleteam)
          message.reply("This person has now been kicked out of `" + rolename + "`!")
          sendLeaveMsg(member, rolename, roleemoji)
        } else {
          message.reply("This person isn't in `" + rolename + "`!")
        }
      } else if(res2) {
        //team platinum, has perms to kick
        let rolename = "Team Platinum"
        let roleemoji = process.env.platinumEmoji
        let roleteam = message.guild.roles.cache.find(role => role.name == rolename);
        let res3 = member.roles.cache.some(role => role.name == rolename);
        if (member.user.id == message.member.user.id) {
          message.reply("You can't kick yourself! do ?leave platinum to leave your team!")
        } else if (res3) {
          member.roles.remove(roleteam)
          message.reply("This person has now been kicked out of `" + rolename + "`!")
          sendLeaveMsg(member, rolename, roleemoji)
        } else {
          message.reply("This person isn't in `" + rolename + "`!")
        }
      } else {
        //team undefined, has no perms to kick
        message.reply("You do not have the permission to do this command.")
      }
      
      talkedRecently.add(message.author.id);
      setTimeout(() => {
        // Removes the user from the set after a minute
        talkedRecently.delete(message.author.id);
      }, commandDelay * 1000);
    }
  }
}