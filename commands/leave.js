const talkedRecently = new Set();
const commandDelay = 2.5 //seconds 

module.exports = {
  name: 'leave',
  description: 'Leave a team you specify if you are a part of it.',
  execute(message, args, client){
    if (talkedRecently.has(message.author.id)) {
            message.channel.send("Please wait " + commandDelay + " second(s) until you can use this command again");
    } else {

function sendLeaveMsg(message, roleName, roleEmoji) {
  const channel = client.channels.cache.find(channel => channel.name === "team-changes")
  channel.send("`" + message.author.tag + "` has left `" + roleName + "` " + roleEmoji + " !")
}
if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply("You are too powerful to play the server!");
  if (message.guild == null) return message.reply("You cannot do this command in DMs.");
    if (args[1] == "diamond" || args[1] == "d") {
      const roleNameLeader = "Team Diamond Leader"
      const roleName = "Team Diamond"
      const roleEmoji = process.env.diamondEmoji
      let roleleader = message.guild.roles.cache.find(role => role.name == roleNameLeader);
      let roleteam = message.guild.roles.cache.find(role => role.name == roleName);
      let hasLRole = message.member.roles.cache.find(role => role.name == roleNameLeader);
      let hasRole = message.member.roles.cache.find(role => role.name == roleName);
      if (hasLRole && hasRole) {
        message.guild.members.cache.get(message.author.id).roles.remove(roleleader);
        message.guild.members.cache.get(message.author.id).roles.remove(roleteam);
        message.reply("You are no longer a leader of " + roleName)
        sendLeaveMsg(message, roleName, roleEmoji)
      } else if (hasLRole && !hasRole) {
        message.guild.members.cache.get(message.author.id).roles.remove(roleleader);
        message.reply("You are no longer a leader of " + roleName)
        sendLeaveMsg(message, roleName, roleEmoji)
      } else if (!hasLRole && hasRole) {
        message.guild.members.cache.get(message.author.id).roles.remove(roleteam);
        message.reply("You are no longer a member of " + roleName)
        sendLeaveMsg(message, roleName, roleEmoji)
      } else {
        message.reply("You are not a part of " + roleName + ".")
      }
    } else if (args[1] == "pearl" || args[1] == "p" ) {
      const roleNameLeader = "Team Pearl Leader"
      const roleName = "Team Pearl"
      const roleEmoji = process.env.pearlEmoji
      let roleleader = message.guild.roles.cache.find(role => role.name == roleNameLeader);
      let roleteam = message.guild.roles.cache.find(role => role.name == roleName);
      let hasLRole = message.member.roles.cache.find(role => role.name == roleNameLeader);
      let hasRole = message.member.roles.cache.find(role => role.name == roleName);
      if (hasLRole && hasRole) {
        message.guild.members.cache.get(message.author.id).roles.remove(roleleader);
        message.guild.members.cache.get(message.author.id).roles.remove(roleteam);
        message.reply("You are no longer a leader of " + roleName)
        sendLeaveMsg(message, roleName, roleEmoji)
      } else if (hasLRole && !hasRole) {
        message.guild.members.cache.get(message.author.id).roles.remove(roleleader);
        message.reply("You are no longer a leader of " + roleName)
        sendLeaveMsg(message, roleName, roleEmoji)
      } else if (!hasLRole && hasRole) {
        message.guild.members.cache.get(message.author.id).roles.remove(roleteam);
        message.reply("You are no longer a member of " + roleName)
        sendLeaveMsg(message, roleName, roleEmoji)
      } else {
        message.reply("You are not a part of " + roleName + ".")
      }
    } else if (args[1] == "platinum" || args[1] == "plat" || args[1] == "pt") {
      const roleNameLeader = "Team Platinum Leader"
      const roleName = "Team Platinum"
      const roleEmoji = process.env.platinumEmoji
      let roleleader = message.guild.roles.cache.find(role => role.name == roleNameLeader);
      let roleteam = message.guild.roles.cache.find(role => role.name == roleName);
      let hasLRole = message.member.roles.cache.find(role => role.name == roleNameLeader);
      let hasRole = message.member.roles.cache.find(role => role.name == roleName);
      if (hasLRole && hasRole) {
        message.guild.members.cache.get(message.author.id).roles.remove(roleleader);
        message.guild.members.cache.get(message.author.id).roles.remove(roleteam);
        message.reply("You are no longer a leader of " + roleName)
        sendLeaveMsg(message, roleName, roleEmoji)
      } else if (hasLRole && !hasRole) {
        message.guild.members.cache.get(message.author.id).roles.remove(roleleader);
        message.reply("You are no longer a leader of " + roleName)
        sendLeaveMsg(message, roleName, roleEmoji)
      } else if (!hasLRole && hasRole) {
        message.guild.members.cache.get(message.author.id).roles.remove(roleteam);
        message.reply("You are no longer a member of " + roleName)
        sendLeaveMsg(message, roleName, roleEmoji)
      } else {
        message.reply("You are not a part of " + roleName + ".")
      }
    } else {
      message.reply("Please specify a team name (type it out in full)!")
    }
      
        talkedRecently.add(message.author.id);
        setTimeout(() => {
          // Removes the user from the set after a minute
          talkedRecently.delete(message.author.id);
        }, commandDelay * 1000);
    }
  }
}