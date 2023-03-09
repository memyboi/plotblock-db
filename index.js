require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const musername = process.env.mongouser
const mpassword = process.env.mongopass
const mongoose = require('mongoose')
const url = `mongodb+srv://${musername}:${mpassword}@plotblock.7cigzsy.mongodb.net/test`
const fs = require('fs');

//BUILD SETTINGS
const devBuild = false
const buildNum = 4

//PLAYER LEVEL SETTINGS
const plrlvlst = {
  "minCashReward": 1,
  "maxCashReward": 1.5,
  "lvlMultiplier": 1.3,
  "lvlRewardMultiplier": 1.3,
  "minXpForLvlUp": 25
}

console.log(plrlvlst)

const plrSchema = require('./schema.js')

const Canvas = require('@napi-rs/canvas');
const { GlobalFonts } = require('@napi-rs/canvas')

const { Client, GatewayIntentBits, Partials, PermissionsBitField, ChannelType, TextInputBuilder, TextInputStyle, ModalBuilder, AttachmentBuilder } = require('discord.js');
const Discord = require("discord.js");
const client = new Client({
  intents: [
  GatewayIntentBits.Guilds, 
  GatewayIntentBits.GuildMessages, 
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.GuildBans,
  ]
});

const path = require('path');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ActivityType, ButtonStyle } = require('discord.js');

const okbutton = new ButtonBuilder()
  .setCustomId('delmsg')
  .setLabel("Ok")
  .setStyle(ButtonStyle.Secondary)

client.commands = new Discord.Collection();

const commandsPath = path.join(__dirname, 'commands');

const { Routes } = require('discord.js');
const { REST } = require("@discordjs/rest")
const clientId = process.env.clientid
const guildId = process.env.guildid
const token = process.env.token

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

console.log(REST)

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    console.log(commands)

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function setCharAt(str,index,chr) {
  if(index > str.length-1) return str;
  return str.substring(0,index) + chr + str.substring(index+1);
}

const addLevel = async (userID, cLevel) => {
  try {
    const result = await plrSchema.findOneAndUpdate({
      userID
    }, {
      userID,
      xp: 0,
      $inc: {
        lvls: 1,
        cash: getRandomArbitrary(plrlvlst.minCoinReward, plrlvlst.maxCoinReward) * (plrlvlst.lvlRewardMultiplier * cLevel)
      }
    }, {
      upsert: true,
      new: true
    })
  } catch(e) {
    console.log(e)
  }
}

const addXP = async (userID, xpToAdd) => {
  try {
    const result = await plrSchema.findOneAndUpdate({
      userID
    }, {
      userID,
      $inc: {
        xp: xpToAdd
      }
    }, {
      upsert: true,
      new: true
    })
  } catch(e) {
    console.log(e)
  }
}

async function doXp(message) {
  addXP(message.author.id, getRandomArbitrary(1, 3))
  let cLevel = 1
  let cXp = 0
  let oCoins = 0
  const findRes = await plrSchema.find({ userID: message.author.id })
  try {
    cLevel = findRes[0].lvls
    cXp = findRes[0].xp
    oCoins = findRes[0].cash
    let nextLvlUpThingy = ((cLevel * plrlvlst.lvlMultiplier) * plrlvlst.minXpForLvlUp)
    if (cXp >= nextLvlUpThingy) {
      //level up
      addLevel(message.author.id, cLevel)
      let nCoins
      const findRes2 = await plrSchema.find({ userID: message.author.id, guildId: message.guild.id })
      try {
        nCoins = findRes2[0].cash
      } catch(e) {
        console.log(e)
      }
      coins = Math.floor(nCoins - oCoins)
      message.author.send("**You've leveled up!**\n\nYou have leveled up to level " + (cLevel + 1) + "!\nYou now have " + nCoins + " cash!") 
    }
  } catch(e) {
    console.log(e)
  }
}

const prefix = '.';

client.on("messageCreate", async message => {
  if (message.guild && !message.author.bot) {
    if (getRandomArbitrary(1, 1) == 1) {
      doXp(message)
    }
  }
})

client.on("ready", async () => {
  await mongoose.connect(
    url,
    {
      keepAlive: true
    }
  )
  console.log("ready and on")
  if (devBuild) {
    client.user.setActivity('dev build ' + buildNum, { type: ActivityType.Playing })
  } else {
    client.user.setActivity("/help [1-4] for help", { type: ActivityType.Playing })
  }
})

client.on("guildMemberAdd", async function(member){
  if (member.guild.id != guildId) return
    const canvas = Canvas.createCanvas(800, 500);
    const context = canvas.getContext('2d');
    const pfp = await Canvas.loadImage(member.displayAvatarURL({format: "png"}))
    const bg = await Canvas.loadImage('./joinbg.png')
    const uname = member.user.username
    const dcrim = member.user.discriminator
    console.log(uname+"#"+dcrim+" has joined! sending join img + verification!")
    
    context.drawImage(bg, 0, 0, canvas.width, canvas.height)
    context.strokeStyle = "#ffffff"
    //context.strokeRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(255,255,255,1)'
    context.font = '50px sans-serif'
    context.fillText(""+uname, 200, 100)
    //context.fillText(text, 0, 0)
    context.fillStyle = 'rgba(155, 155, 155, 1)'
    context.font = '30px sans-serif'
    context.fillText("#" + dcrim, 200, 140)
    //context.fillText(text2, 0, 0)
    // Pick up the pen
    context.beginPath();

    // Start the arc to form a circle
    context.arc(106.5, 105.5, 92.5, 92.5, Math.PI * 1, true);

    // Put the pen down
    context.closePath();

    // Clip off the region you drew on
    context.clip();
    context.drawImage(pfp, 14, 13, 185, 185)

    const a = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId('tos')
        .setLabel('View ToS')
        .setStyle(ButtonStyle.Secondary),
    )

    const newimg = new AttachmentBuilder(await canvas.encode('png'), { name: uname+'#'+dcrim+'-joined.png' })
    client.guilds.fetch("" + process.env.guildid) .then((guild) => {
      guild.channels.fetch("" + process.env.welcomechannelid) .then((channel) => {
        channel.send({ files: [newimg] })
        member.send({
          content: "**Welcome to Plot Block [LIFESTEAL]!**\n\nWe hope you have a good time here!\nPlease click on the button below to begin the first step of the verification process!",
          components: [a]
        })
      })
    })
})

client.on("guildMemberRemove", async member => {
  if (member.guild.id != guildId) return
  const id = member.user.id
  client.guilds.fetch("" + process.env.guildid) .then((guild) => {
    guild.channels.fetch("" + process.env.leavingchannelid) .then(async (channel) => {
      try {
        channel.send("`"+member.user.tag+"` **has unfortunately left the server.**")
      } catch(e) {
        console.log(e);
      }
    })
  })
})

client.on('interactionCreate', async interaction => {
  if (interaction.isButton()) {
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
        .setDescription("----> **Please read the following rules:** <----\n\n----> **You must own:** <----\n> A legit copy of Minecraft Java for Windows, Mac or Linux.\n> A computer running Windows, Mac or Linux.\n\nPlease know that this server is built around a UTC+0 timezone. All events will be made around this timezone.")
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
  };
  if (interaction.isCommand() || interaction.isChatInputCommand()) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
    return
  }
  await interaction.deferUpdate();
})

client.login(process.env.token)