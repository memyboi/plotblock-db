const talkedRecently = new Set();
const commandDelay = 2.5 //seconds 

const sentRequestRecently = new Set();
const requestDelay = 30 //seconds 

const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

const okrow = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('delMsg')
      .setLabel('Ok')
      .setStyle(ButtonStyle.Secondary),
  )

function sendJoinMsg(client, message, roleName, roleEmoji, position) {
  const channel = client.channels.cache.find(channel => channel.name === "team-changes")
  channel.send("`" + message.author.tag + "` has joined `" + roleName + "` as `" + position + "` " + roleEmoji + " !")
}
module.exports = {
  name: 'join',
  description: 'Join the team you specify if possible.',
  execute(message, args, client){
    if (talkedRecently.has(message.author.id)) {
      message.channel.send("Please wait " + commandDelay + " second(s) until you can use this command again");
    } else {
      if (message.author.user.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply("You are too powerful to play the server!");
      if (message.guild == null) return message.reply("You cannot do this command in DMs.");
    
      
    let dLeaderAmnt = 0;
    let diamondLeader;
    let pLeaderAmnt = 0;
    let pearlLeader;
    let ptLeaderAmnt = 0;
    let platinumLeader;
    function getAllMembers() {
      const guild = message.guild
      guild.members.fetch().then(members => {
        members.forEach(member =>
          {
            let hasRole = member.roles.cache.some(role => role.name == "Team Diamond Leader");
            if (hasRole) {
              dLeaderAmnt++;
              diamondLeader = member;
            }
            let hasRole2 = member.roles.cache.some(role => role.name == "Team Pearl Leader");
            if (hasRole2) {
              pLeaderAmnt++;
              pearlLeader = member;
            }
            let hasRole3 = member.roles.cache.some(role => role.name == "Team Platinum Leader");
            if (hasRole3) {
              ptLeaderAmnt++;
              platinumLeader = member;
            }
          });
      });
    }

    getAllMembers()

    setTimeout(() => {
      if (args[1] == "diamond" || args[1] == "d") {
        let hasDLRole = message.member.roles.cache.find(role => role.name == "Team Pearl Leader");
        let hasPLRole = message.member.roles.cache.find(role => role.name == "Team Platinum Leader");
        let hasDRole = message.member.roles.cache.find(role => role.name == "Team Pearl");
        let hasPRole = message.member.roles.cache.find(role => role.name == "Team Platinum");
        if (hasDLRole || hasDRole) return message.reply("You are already in Team Pearl.")
        if (hasPLRole || hasPRole) return message.reply("You are already in Team Platinum.")
        const roleNameLeader = "Team Diamond Leader"
        const roleName = "Team Diamond"
        const roleEmoji = process.env.diamondEmoji
        let roleleader = message.guild.roles.cache.find(role => role.name == roleNameLeader);
        let roleteam = message.guild.roles.cache.find(role => role.name == roleName);
        if (dLeaderAmnt > 0) {
          // someone has the leader role
          let hasLRole = message.member.roles.cache.find(role => role.name == roleNameLeader);
          let hasRole = message.member.roles.cache.find(role => role.name == roleName);
          if (!hasLRole && !hasRole) {
            //you dont have leader
             if (sentRequestRecently.has(message.author.id)) {
            message.channel.send("Please wait " + requestDelay + " second(s) until you can use this command again");
          } else {
            const row = new ActionRowBuilder()
        			.addComponents(
        				new ButtonBuilder()
        					.setCustomId('dec')
        					.setLabel('No')
        					.setStyle(ButtonStyle.Danger),
        			)
              .addComponents(
          				new ButtonBuilder()
          					.setCustomId('acc')
          					.setLabel('Yes')
          					.setStyle(ButtonStyle.Success),
          			);

            diamondLeader.send({content: "(" + message.channel.id + " " + message.guild.id + ")\n\n <@" + message.author.id + "> would like to join your team, `" + roleName + "` " + roleEmoji + " . Click/Tap on `Yes` to `accept`, `No` to `decline`.", components: [row]}) .then((sMsg) => {
            message.reply("Sent request to `" + diamondLeader.user.tag + "` (`" + roleNameLeader + "`) .");
            // Adds the user to the set so that they can't talk for a minute
            sentRequestRecently.add(message.author.id);
            setTimeout(() => {
              // Removes the user from the set after a minute
              sentRequestRecently.delete(message.author.id);
              if (sMsg) sMsg.edit({content: "The request from <@" + message.author.id + "> has expired.", components: [okrow]});
            }, requestDelay * 1000);
            }) .catch((err) => {
              console.log(err)
              message.reply("Unable to send request to " + diamondLeader.user.tag + ". They may have me (the bot) blocked or have direct messages disabled or there was an error.\nDetails:\n```" + err + "```");
            })
            // Adds the user to the set so that they can't talk for a minute
            sentRequestRecently.add(message.author.id);
            setTimeout(() => {
              // Removes the user from the set after a minute
              sentRequestRecently.delete(message.author.id);
            }, requestDelay * 1000);
          }
          } else {
            if (hasLRole) {
              //you are leader
              message.reply("You are already the Leader of " + roleName + "!")
            } else if (hasRole) {
              //you are a member
              message.reply("You are already a member of " + roleName + "!")
            } else {
              //error happened lmao
              message.reply("An error occurred. No changes have been made.")
            }
            
          }
        } else {
        // no one else has a leader role
        message.guild.members.cache.get(message.author.id).roles.add(roleleader);
        message.guild.members.cache.get(message.author.id).roles.add(roleteam);
        message.reply("Successfully joined " + roleName + " as the Leader.");
        sendJoinMsg(client, message, roleName, roleEmoji, "Leader")
      }
    } else if (args[1] == "pearl" || args[1] == "p" ) {
      let hasDLRole = message.member.roles.cache.find(role => role.name == "Team Diamond Leader");
      let hasPLRole = message.member.roles.cache.find(role => role.name == "Team Platinum Leader");
      let hasDRole = message.member.roles.cache.find(role => role.name == "Team Diamond");
      let hasPRole = message.member.roles.cache.find(role => role.name == "Team Platinum");
      if (hasDLRole || hasDRole) return message.reply("You are already in Team Diamond.")
      if (hasPLRole || hasPRole) return message.reply("You are already in Team Platinum.")
      const roleNameLeader = "Team Pearl Leader"
      const roleName = "Team Pearl"
      const roleEmoji = process.env.pearlEmoji
      let roleleader = message.guild.roles.cache.find(role => role.name == roleNameLeader);
      let roleteam = message.guild.roles.cache.find(role => role.name == roleName);
      if (pLeaderAmnt > 0) {
        // someone has the leader role
        let hasLRole = message.member.roles.cache.find(role => role.name == roleNameLeader);
        let hasRole = message.member.roles.cache.find(role => role.name == roleName);
        if (!hasLRole && !hasRole) {
          //you dont have leader
          if (sentRequestRecently.has(message.author.id)) {
            message.channel.send("Please wait " + requestDelay + " second(s) until you can use this command again");
          } else {
            const row = new ActionRowBuilder()
        			.addComponents(
        				new ButtonBuilder()
        					.setCustomId('dec')
        					.setLabel('No')
        					.setStyle(ButtonStyle.Danger),
        			)
              .addComponents(
          				new ButtonBuilder()
          					.setCustomId('acc')
          					.setLabel('Yes')
          					.setStyle(ButtonStyle.Success),
          			);

            pearlLeader.send({content: "(" + message.channel.id + " " + message.guild.id + ")\n\n <@" + message.author.id + "> would like to join your team, `" + roleName + "` " + roleEmoji + " . Click/Tap on `Yes` to `accept`, `No` to `decline`.", components: [row]}) .then((sMsg) => {
            message.reply("Sent request to `" + pearlLeader.user.tag + "` (`" + roleNameLeader + "`) .");
            // Adds the user to the set so that they can't talk for a minute
            sentRequestRecently.add(message.author.id);
            setTimeout(() => {
              // Removes the user from the set after a minute
              sentRequestRecently.delete(message.author.id);
              if (sMsg) sMsg.edit({content: "The request from <@" + message.author.id + "> has expired.", components: [okrow]});
            }, requestDelay * 1000);
            }) .catch((err) => {
              console.log(err)
              message.reply("Unable to send request to " + pearlLeader.user.tag + ". They may have me (the bot) blocked or have direct messages disabled or there was an error.\nDetails:\n```" + err + "```");
            })
          }
        } else {
          if (hasLRole) {
            //you are leader
            message.reply("You are already the Leader of " + roleName + "!")
          } else if (hasRole) {
            //you are a member
            message.reply("You are already a member of " + roleName + "!")
          } else {
            //error happened lmao
            message.reply("An error occurred. No changes have been made.")
          }
          
        }
      } else {
      // no one else has a leader role
      message.guild.members.cache.get(message.author.id).roles.add(roleleader);
      message.guild.members.cache.get(message.author.id).roles.add(roleteam);
      message.reply("Successfully joined " + roleName + " as the Leader.");
      sendJoinMsg(client, message, roleName, roleEmoji, "Leader")
      }
    } else if (args[1] == "platinum" || args[1] == "plat" || args[1] == "pt") {
      let hasDLRole = message.member.roles.cache.find(role => role.name == "Team Diamond Leader");
      let hasPLRole = message.member.roles.cache.find(role => role.name == "Team Pearl Leader");
      let hasDRole = message.member.roles.cache.find(role => role.name == "Team Diamond");
      let hasPRole = message.member.roles.cache.find(role => role.name == "Team Pearl");
      if (hasDLRole || hasDRole) return message.reply("You are already in Team Diamond.")
      if (hasPLRole || hasPRole) return message.reply("You are already in Team Pearl.")
      const roleNameLeader = "Team Platinum Leader"
      const roleName = "Team Platinum"
      const roleEmoji = process.env.platinumEmoji
      let roleleader = message.guild.roles.cache.find(role => role.name == roleNameLeader);
      let roleteam = message.guild.roles.cache.find(role => role.name == roleName);
      if (ptLeaderAmnt > 0) {
        // someone has the leader role
        let hasLRole = message.member.roles.cache.find(role => role.name == roleNameLeader);
        let hasRole = message.member.roles.cache.find(role => role.name == roleName);
        if (!hasLRole && !hasRole) {
          //you dont have leader
          if (sentRequestRecently.has(message.author.id)) {
            message.channel.send("Please wait " + requestDelay + " second(s) until you can use this command again");
          } else {
            const row = new ActionRowBuilder()
        			.addComponents(
        				new ButtonBuilder()
        					.setCustomId('dec')
        					.setLabel('No')
        					.setStyle(ButtonStyle.Danger),
        			)
              .addComponents(
          				new ButtonBuilder()
          					.setCustomId('acc')
          					.setLabel('Yes')
          					.setStyle(ButtonStyle.Success),
          			);

            platinumLeader.send({content: "(" + message.channel.id + " " + message.guild.id + ")\n\n <@" + message.author.id + "> would like to join your team, `" + roleName + "` " + roleEmoji + " . Click/Tap on `Yes` to `accept`, `No` to `decline`.", components: [row]}) .then((sMsg) => {
            message.reply("Sent request to `" + platinumLeader.user.tag + "` (`" + roleNameLeader + "`) .");
            // Adds the user to the set so that they can't talk for a minute
            sentRequestRecently.add(message.author.id);
            setTimeout(() => {
              // Removes the user from the set after a minute
              sentRequestRecently.delete(message.author.id);
              if (sMsg) sMsg.edit({content: "The request from <@" + message.author.id + "> has expired.", components: [okrow]});
            }, requestDelay * 1000);
            }) .catch((err) => {
              console.log(err)
              message.reply("Unable to send request to " + platinumLeader.user.tag + ". They may have me (the bot) blocked or have direct messages disabled or there was an error.\nDetails:\n```" + err + "```");
            })
          }
        } else {
          if (hasLRole) {
            //you are leader
            message.reply("You are already the Leader of " + roleName + "!")
          } else if (hasRole) {
            //you are a member
            message.reply("You are already a member of " + roleName + "!")
          } else {
            //error happened lmao
            message.reply("An error occurred. No changes have been made.")
          }
          
        }
      } else {
      // no one else has a leader role
      message.guild.members.cache.get(message.author.id).roles.add(roleleader);
      message.guild.members.cache.get(message.author.id).roles.add(roleteam);
      message.reply("Successfully joined " + roleName + " as the Leader.");
      sendJoinMsg(client, message, roleName, roleEmoji, "Leader")
      }
    } else {
      message.reply("Please specify a team name (type it out in full)!")
    }
    }, 250);
      talkedRecently.add(message.author.id);
      setTimeout(() => {
        // Removes the user from the set after a minute
        talkedRecently.delete(message.author.id);
      }, commandDelay * 1000);
    }
  }
}