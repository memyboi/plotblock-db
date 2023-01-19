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

//

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

      case 'serverinfo':
        client.commands.get('serverinfo').execute(message, args, client);
      break;

      case 'si':
        client.commands.get('serverinfo').execute(message, args, client);
      break;

      case 'help':
        const helpEmbed = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle("Command help:")
          .setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`})
          .setDescription('Do ' + prefix + "help [1-4] for info about me!")
          .addFields(
            { name: "Page 1", value: "Generic commands", inline: true },
            { name: "Page 2", value: "Team commands", inline: true },
            { name: "Page 1", value: "Admin commands", inline: true },
            { name: "Page 4", value: "Bot info", inline: true },
          )
          .setTimestamp()

        const helpEmbed1 = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle("Generic commands help:")
          .setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`})
          .setDescription('' + prefix + "help page 1 | Generic commands")
          .addFields(
            { name: prefix + client.commands.get('roles').name, value: client.commands.get('roles').description, inline: true },
            { name: prefix + client.commands.get('serverinfo').name, value: client.commands.get('serverinfo').description, inline: true },
          )
          .setTimestamp()

        const helpEmbed2 = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle("Team commands help:")
          .setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`})
          .setDescription('' + prefix + "help page 2 | Team commands")
          .addFields(
            { name: prefix + client.commands.get('join').name, value: client.commands.get('join').description, inline: true },
            { name: prefix + client.commands.get('leave').name, value: client.commands.get('leave').description, inline: true },
            { name: prefix + client.commands.get('kick').name, value: client.commands.get('kick').description, inline: true },
          )
          .setTimestamp()

        const helpEmbed3 = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle("Admin commands help:")
          .setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`})
          .setDescription('' + prefix + "help page 3 | Admin commands")
          .addFields(
            { name: prefix + client.commands.get('kickfs').name, value: client.commands.get('kickfs').description, inline: true },
            { name: prefix + client.commands.get('banfs').name, value: client.commands.get('banfs').description, inline: true },
            { name: prefix + client.commands.get('unbanfs').name, value: client.commands.get('unbanfs').description, inline: true },
            { name: prefix + client.commands.get('warn').name, value: client.commands.get('warn').description, inline: true },
            { name: prefix + client.commands.get('clear').name, value: client.commands.get('clear').description, inline: true },
          )
          .setTimestamp()

        const helpEmbed4 = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle("Info help:")
          .setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`})
          .setDescription('' + prefix + "help page 4")
          .addFields(
            { name: "Who created me?", value: "DeadFry42#5445", inline: true },
            { name: "What is my purpose?", value: "My purpose is to keep the server's teams organised and to do other stuff related to this server.", inline: true },
          )
          .setTimestamp()

        if (args[1] == "1") {
          return message.reply({ embeds: [helpEmbed1]});
        } else if (args[1] == "2") {
          return message.reply({ embeds: [helpEmbed2]});
        } else if (args[1] == "3") {
          return message.reply({ embeds: [helpEmbed3]});
        } else if (args[1] == "4") {
          return message.reply({ embeds: [helpEmbed4]});
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
  } else if (interaction.customId == "tos") {
    //type tos here
    const rowpage = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('tosp2')
          .setLabel('Next page')
          .setStyle(ButtonStyle.Secondary),
      )

    const tosp1 = new EmbedBuilder()
      .setAuthor({ name: "Plot Block TOS", iconURL: "https://cdn.discordapp.com/attachments/1022965804523847720/1022965863793557654/IMG_1109.PNG"})
      .setDescription("----> **Please read the following rules:** <----\n\n----> **You must own:** <----\n> A legit copy of Minecraft Java for Windows, Mac or Linux.\n> A computer running Windows, Mac or Linux.\n\n")
      .setColor("#ff0000")

    interaction.message.edit({
      content: "",
      embeds: [tosp1],
      components: [rowpage],
    })
  } else if (interaction.customId == "acctos") {
    interaction.message.edit({
      content: "The TOS has been accepted. You are now verified.",
      embeds: [],
      components: [],
    })
    client.guilds.fetch("" + process.env.guildid) .then((guild) => {
      const memberMesure = guild.members.cache.get("" + interaction.user.id);
      if (memberMesure) {
        let role = guild.roles.cache.find(role => role.name == "verified bozo");
        memberMesure.roles.add(role)
      }
    })
  } else if (interaction.customId == "dectos") {
    interaction.message.edit({
      content: "The TOS has been declined. You are now kicked from the server.",
      embeds: [],
      components: [],
    })
    client.guilds.fetch("" + process.env.guildid) .then((guild) => {
      const memberMesure = guild.members.cache.get("" + interaction.user.id);
      if (memberMesure) {
        memberMesure.kick("Declined TOS on entry")
      }
    })
  } else if (interaction.customId == "tosp2") {
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('acctos')
          .setLabel('Accept and verify')
          .setStyle(ButtonStyle.Success),
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId('dectos')
          .setLabel('Decline and leave')
          .setStyle(ButtonStyle.Danger),
      )

    const tosp2 = new EmbedBuilder()
      .setAuthor({ name: "Plot Block TOS", iconURL: "https://cdn.discordapp.com/attachments/1022965804523847720/1022965863793557654/IMG_1109.PNG"})
      .setDescription("----> **Please read the following rules:** <----\n\n----> **Please acknowledge the following:** <----\n> This is a lifesteal server. You will die, and you will lose hearts.\n> This is a survival server, You will be raided, attacked and betrayed. This is standard.\n> This is a modded server, You will have access to modded items and modded mechanics\n\n**Please do not infringe any of the rules stated in the 'Rules' channel in the server.**")
      .setColor("#ff0000")

    interaction.message.edit({
      content: "",
      embeds: [tosp2],
      components: [row],
    })
  }
  await interaction.deferUpdate();
});

client.on("ready", async () => {
  console.log("ready and on")
  client.user.setActivity(prefix + 'help [1-4] for help', { type: ActivityType.Playing })
})

client.on("guildMemberAdd", function(member){
  client.commands.get('guildmemberadd').execute(member, client);
})

client.login(process.env.token)