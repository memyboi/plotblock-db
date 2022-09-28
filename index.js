require('dotenv').config()

const { Client, GatewayIntentBits, Partials } = require('discord.js');
const Discord = require("discord.js");
const client = new Client({
  intents: [
  GatewayIntentBits.Guilds, 
  GatewayIntentBits.GuildMessages, 
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.GuildBans,
  ],
  partials: [
  Partials.Channel
  ]
});
const fs = require('fs');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ActivityType, ButtonStyle } = require('discord.js');


client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command)
}

function sendJoinMsg(guild, joiner, roleName, roleEmoji, position) {
  const channel = guild.channels.cache.find(channel => channel.name === "team-changes")
  channel.send("`" + joiner.tag + "` has joined `" + roleName + "` as `" + position + "` " + roleEmoji + " !")
}
function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}

const prefix = '?';

client.on("messageCreate", async message => {
  if (message.content.toLowerCase().startsWith(prefix) && !message.author.bot) {
    let args = message.content.substring(prefix.length).toLowerCase().split(" ")
    if (message.guild != null) { if (!message.guild.members.cache.get(message.author.id).roles.cache.some(role => role.name === 'verified bozo')) return message.reply("You must be verified to use me!") }
    switch(args[0]){
      case 'roles':
        client.commands.get('roles').execute(message, args, client);
      break;

      case 'join':
        client.commands.get('join').execute(message, args, client);
      break;

      case 'leave':
        client.commands.get('leave').execute(message, args, client);
      break;

      case 'kick':
        client.commands.get('kick').execute(message, args, client);
      break;

      case 'kickfs':
        client.commands.get('kickfs').execute(message, args, client);
      break

      case 'warn':
        client.commands.get('warn').execute(message, args, client);
      break;

      case 'banfs':
        client.commands.get('banfs').execute(message, args, client);
      break;

      case 'unbanfs':
        client.commands.get('unbanfs').execute(message, args, client);
      break;

      case 'clear':
        client.commands.get('clear').execute(message, args, client);
      break;

      case 'help':
        const helpEmbed = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle("Command help:")
          .setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`})
          .setDescription('Do ' + prefix + "help [1-2] for info about me!")
          .addFields(
            { name: "Page 1", value: "Commands", inline: true },
            { name: "Page 2", value: "Bot info", inline: true },
          )
          .setTimestamp()

        const helpEmbed1 = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle("Command help:")
          .setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`})
          .setDescription('' + prefix + "help page 1")
          .addFields(
            { name: prefix + client.commands.get('roles').name, value: client.commands.get('roles').description, inline: true },
          )
          .setTimestamp()

        const helpEmbed2 = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle("Command help:")
          .setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`})
          .setDescription('' + prefix + "help page 2")
          .addFields(
            { name: "Who created me?", value: "DeadFry42#5445", inline: true },
            { name: "What is my purpose?", value: "My purpose is to keep the server's teams organised and to do other stuff related to this server.", inline: true },
          )
          .setTimestamp()

        if (args[1] == "1") {
          return message.reply({ embeds: [helpEmbed1]});
        } else if (args[1] == "2") {
          return message.reply({ embeds: [helpEmbed2]});
        }
        message.reply({ embeds: [helpEmbed]});
      break;
    }
  } else {
    if (message.author.bot) return;
  }
})

const okrow = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('delMsg')
      .setLabel('Ok')
      .setStyle(ButtonStyle.Secondary),
  )

// setTimeout(() => {
//     let tdid = 1019686123435479040
//     let tpid = 1019686393506701322
//     let tptid = 1019686451836891246
//     let guildid = 1012028211275763753
    
//     client.guilds.fetch(""+guildid) .then((guild) => {
//       console.log(guild)
//       let tdc = guild.channels.cache.get(channel => channel.id == tdid)
//       let tpc = guild.channels.cache.get(channel => channel.id == tpid)
//       let tptc = guild.channels.cache.get(channel => channel.id == tptid)
    
//       const td = guild.roles.cache.get(role => role.name == "Team Diamond");
//       tdc.setName("Team Diamond: " + td.members.cache.size) .catch((err) => {
//         console.log(err)
//       })
    
//       const tp = guild.roles.cache.get(role => role.name == "Team Pearl");
//       tpc.setName("Team Pearl: " + tp.members.cache.size) .catch((err) => {
//         console.log(err)
//       })
    
//       const tpt = guild.roles.cache.get(role => role.name == "Team Platinum");
//       tptc.setName("Team Platinum: " + tpt.members.cache.size) .catch((err) => {
//         console.log(err)
//       })
//     }) .catch((err) => {
//       console.log(err)
//     })
//   }, 1000);

client.on('interactionCreate', async interaction => {
  
	if (!interaction.isButton()) return;
  
  if (interaction.customId == "acc") {
    const message = interaction.message //message of interaction
    const leader = message.channel.recipient
    const msgArgs = message.content.replace("(", "").replace(")", "").split(" ")
    const channelid = msgArgs[0]
    const guildid = msgArgs[1]
    const member = getUserFromMention(msgArgs[2])

    message.edit({content: "This request from <@" + member.id + "> has been accepted."})
    
    message.reply("Adding <@" + member.id + "> to your team...") .then((conf) => {

      client.guilds.fetch("" + guildid) .then((guild) => {
        const memberMesure = guild.members.cache.get("" + member.id);
        const lmemberMesure = guild.members.cache.get("" + leader.id);
    
        if (memberMesure) {
          const res = memberMesure.roles.cache.some(role => role.name == "Team Diamond Leader");
          const res1 = memberMesure.roles.cache.some(role => role.name == "Team Pearl Leader");
          const res2 = memberMesure.roles.cache.some(role => role.name == "Team Platinum Leader");
          const res3 = memberMesure.roles.cache.some(role => role.name == "Team Diamond");
          const res4 = memberMesure.roles.cache.some(role => role.name == "Team Pearl");
          const res5 = memberMesure.roles.cache.some(role => role.name == "Team Platinum");
          if (!res && !res1 && !res2 && !res3 && !res4 && !res5) {
            //member is able to be added, check for which team:
            const lres = lmemberMesure.roles.cache.some(role => role.name == "Team Diamond Leader");
            const lres1 = lmemberMesure.roles.cache.some(role => role.name == "Team Pearl Leader");
            const lres2 = lmemberMesure.roles.cache.some(role => role.name == "Team Platinum Leader");

            if(lres) {
              //add to team diamond
              let role = guild.roles.cache.find(role => role.name == "Team Diamond");
              let emoji = process.env.diamondEmoji
              memberMesure.roles.add(role);
              member.send("You have been added to `Team Diamond` " + emoji + " by <@" + leader.id + ">!")
              conf.edit({content: "Added <@" + member.id + "> to `Team Diamond`!"})
              sendJoinMsg(guild, member, "Team Diamond", emoji, "Member")
            } else if(lres1) {
              //add to team pearl
              let role = guild.roles.cache.find(role => role.name == "Team Pearl");
              let emoji = process.env.pearlEmoji
              memberMesure.roles.add(role);
              member.send("You have been added to `Team Pearl` " + emoji + " by <@" + leader.id + ">!")
              conf.edit({content: "Added <@" + member.id + "> to `Team Pearl`!"})
              sendJoinMsg(guild, member, "Team Pearl", emoji, "Member")
            } else if(lres2) {
              //add to team platinum
              let role = guild.roles.cache.find(role => role.name == "Team Platinum");
              let emoji = process.env.platinumEmoji
              memberMesure.roles.add(role);
              member.send("You have been added to `Team Platinum` " + emoji + " by <@" + leader.id + ">!")
              conf.edit({content: "Added <@" + member.id + "> to `Team Platinum`!"})
              sendJoinMsg(guild, member, "Team Platinum", emoji, "Member")
            } else {
              //team undefined? send err
              conf.edit({content: "There was an error adding <@" + member.id + "> to your team. Your team could not be found in the server for some odd reason."})
            }
          } else {
            conf.edit({content: "There was an error adding <@" + member.id + "> to your team. Did they already join another team?"})
          }
        } else {
          //member is not in the guild for some reason
          conf.edit({content: "There was an error adding <@" + member.id + "> to your team. Did they leave the server?"})
        }
      });
    }) .catch((err) => {
      message.reply({content: "There was an error adding <@" + member.id + "> to your team. Details:\n```" + err + "```\n\nThis is a bug in the code. Please, report this to <@529331877727698954> if possible.", components: [okrow]})
      console.log(err)
    })
  } else if (interaction.customId == "dec") {
    const message = interaction.message
    
    const msgArgs = message.content.replace("(", "").replace(")", "").split(" ")
    const channelId = msgArgs[0]
    const guildId = msgArgs[1]
    const member = getUserFromMention(msgArgs[2])
    const leader = message.channel.recipient

    client.guilds.fetch("" + guildId) .then((guild) => {
      const memberMesure = guild.members.cache.get("" + leader.id);
  
      if (memberMesure) {
        const res = memberMesure.roles.cache.some(role => role.name == "Team Diamond Leader");
        const res1 = memberMesure.roles.cache.some(role => role.name == "Team Pearl Leader");
        const res2 = memberMesure.roles.cache.some(role => role.name == "Team Platinum Leader");
        if (res) {
          member.send({content: "You have been denied access into <@" + leader.id + ">'s `Team Diamond`.", components: [okrow]});
        } else if (res1) {
          member.send({content: "You have been denied access into <@" + leader.id + ">'s `Team Pearl`.", components: [okrow]});
        } else if (res2) {
          member.send({content: "You have been denied access into <@" + leader.id + ">'s `Team Platinum`.", components: [okrow]});
        } else {
          member.send({content: "You have been denied access into <@" + leader.id + ">'s Team.", components: [okrow]});
        }
        message.edit({content: "This request from <@" + member.id + "> has been declined."})
      } else {
        message.edit({content: "This request from <@" + member.id + "> has been declined. However, due to an error, they have not been notified"})
      }
    });
    
    
      
  } else if (interaction.customId == "delMsg") {
    const message = interaction.message
    message.delete();
  }
  await interaction.deferUpdate();
});

client.on("ready", async () => {
  console.log("ready and on")
  client.user.setActivity(prefix + 'help for help', { type: ActivityType.Playing })
})


client.login(process.env.token)