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
  "minCoinReward": 5,
  "maxCoinReward": 10,
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
const axios = require('axios')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
 
app.use(express.urlencoded({ extended: true }))
 
app.post('/link', (req, res) => {
    const discordUsername = req.body.discordUsername
    // TODO: handle the request and send a response
    res.send('Success')
})
 
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})


const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ActivityType, ButtonStyle } = require('discord.js');

const okbutton = new ButtonBuilder()
  .setCustomId('delmsg')
  .setLabel("Ok")
  .setStyle(ButtonStyle.Secondary)

const okrow = new ActionRowBuilder()
  .addComponents(okbutton)

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

function getUserFromMention(mention, callback) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		client.users.fetch(""+mention) .then((user) => {
      callback(user)
    })
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
  console.log(parseInt(getRandomArbitrary(plrlvlst.minCoinReward, plrlvlst.maxCoinReward) * (plrlvlst.lvlRewardMultiplier * cLevel)))
  console.log("cLevel ", cLevel)
  console.log("mincr ", plrlvlst.minCoinReward)
  console.log("maxcr ", plrlvlst.maxCoinReward)
  console.log("lrm ", plrlvlst.lvlRewardMultiplier)
  try {
    const result = await plrSchema.findOneAndUpdate({
      userID
    }, {
      userID,
      xp: 0,
      $inc: {
        lvls: 1,
        cash: parseInt(getRandomArbitrary(plrlvlst.minCoinReward, plrlvlst.maxCoinReward) * (plrlvlst.lvlRewardMultiplier * cLevel))
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
      message.author.send("**You've leveled up!**\n\nYou have leveled up to level " + (cLevel + 1) + "!\nYou now have " + nCoins + " cash! (+"+coins+")") 
    }
  } catch(e) {
    console.log(e)
  }
}

const prefix = '.';

client.on("messageCreate", async message => {
  
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
    client.user.setActivity("/help | Plotblock management", { type: ActivityType.Playing })
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
        var talkrole = guild.roles.cache.find(role => role.id == "1084582068316549252")
        member.roles.add(talkrole)
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

client.on('messageCreate', async (message) => {
  if (message.guild && !message.author.bot) {
    if (message.channel.id == "1025101523933466634") { //verification channel
      try {
        if (message.author.id+"" != "529331877727698954") {
          message.delete()
        }
      } catch(e) {
        console.log(e)
      }
    }
    if (getRandomArbitrary(1, 3) == 1) {
      doXp(message)
    }
  } else if (message.author.bot) {
    //check if in funny discadia votes channel
    if (message.channel.id == "1099013400765415486" && message.author.id == "1099013419824316466") {
      //probably discadia webhook
      message.embeds.forEach((embed) => {
        console.log(embed)
        const desc = embed.description
        const descArgs = desc.split(" ")
        console.log(descArgs)
        const mentionPlain = descArgs[0]
        console.log(mentionPlain)
        getUserFromMention(mentionPlain, async (user) => {
          console.log(user.username+" has voted! give them lots of money and praise (yipeee)")
          try {
            const userID = user.id
            const result = await plrSchema.findOneAndUpdate({
              userID
            }, {
              userID,
              $inc: {
                cash: 250,
                votes: 1
              }
            }, {
              upsert: true,
              new: true
            })
            try {
              if (result.votes > 1) {
                user.send({content: "**Hey!**\nThanks for voting! You have recieved 250 cash as a reward!\nYou now have " + result.cash + " cash! (+250)"})
              } else {
                try {
                  const result = await plrSchema.findOneAndUpdate({
                    userID
                  }, {
                    userID,
                    $inc: {
                      cash: 50
                    }
                  }, {
                    upsert: true,
                    new: true
                  })
                  user.send({content: "**Hey!**\nThanks for voting! Thank you for helping support this server, and as a first time vote, you will recieve an extra 50 cash ontop of your promised 250!\nYou now have "+result.cash+" cash! (+300)"})
                } catch(e) {
                  console.log("vote error - first vote. details:\n"+e)
                }
              }
            } catch(e) {
              console.log("Err while sending msg to user. details:\n"+e)
            }
            
          } catch(e) {
            console.log("err with adding initial 250. details:\n"+e)
          }
        })
      });
    }
  }
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
      interaction.message.delete()
      interaction.deferUpdate()
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
          let role = guild.roles.cache.find(role => role.id == "1022631935614406730");
          memberMesure.roles.add(role)
          if (!memberMesure.roles.cache.some(role => role.id == "1084582068316549252")) memberMesure.roles.add(talkrole)
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
    } else if (interaction.customId == "RESETALLDATA") {
      //By unlinking, you agree to be unverified, and your data will be removed. The minecraft account that is associated with your account can continue playing, however any features that are dependant on the discord to minecraft link will be unnaccessible. Please type "+'"unlink my accounts please."'+" to reset your data.
      const text = new Discord.TextInputBuilder()
        .setLabel("Reset data below:")
        .setPlaceholder('Type "unlink my accounts please." to reset your data')
        .setStyle(Discord.TextInputStyle.Short)
        .setCustomId("ModalTextInput")
      const row = new ActionRowBuilder()
        .addComponents(text)
      const modal = new ModalBuilder()
        .setTitle("Are you sure you would like to unlink?")
        .setCustomId("ResetModal")
        .setComponents(row)
      await interaction.showModal(modal)
    } else if (interaction.customId == "createaclan") {
      //By unlinking, you agree to be unverified, and your data will be removed. The minecraft account that is associated with your account can continue playing, however any features that are dependant on the discord to minecraft link will be unnaccessible. Please type "+'"unlink my accounts please."'+" to reset your data.
      const text = new Discord.TextInputBuilder()
        .setLabel("Clan Name")
        .setPlaceholder('The name of the clan. eg. Diamond, Pearl')
        .setStyle(Discord.TextInputStyle.Short)
        .setCustomId("clanname")
        .setMinLength(3)
        .setMaxLength(15)
      const row = new ActionRowBuilder()
        .addComponents(text)
      const textdesc = new Discord.TextInputBuilder()
        .setLabel("Clan Description")
        .setPlaceholder('The description of your clan.')
        .setStyle(Discord.TextInputStyle.Paragraph)
        .setCustomId("clandesc")
        .setMinLength(50)
        .setMaxLength(500)
      const rowdesc = new ActionRowBuilder()
        .addComponents(textdesc)
      const textcolour = new Discord.TextInputBuilder()
        .setLabel("Clan Colour (google hex colour picker)")
        .setPlaceholder('The hex colour code for your clan.')
        .setStyle(Discord.TextInputStyle.Short)
        .setMinLength(7)
        .setMaxLength(7)
        .setCustomId("clancolour")
      const rowcolour = new ActionRowBuilder()
        .addComponents(textcolour)
      const modal = new ModalBuilder()
        .setTitle("Create a clan.")
        .setCustomId("ClanCreateModal")
        .setComponents(row, rowdesc, rowcolour)
      await interaction.showModal(modal)
    } else if (interaction.customId == "ClanCreateModal") {
      interaction.reply({content: "Are you sure you want to make a clan? This will take 1k of your cash.\nYour clan information:", ephemeral: true})
    } else if (interaction.customId.includes("-go")) {
      const teamschema = require("./schemateam.js")
      const plrschema = require("./schema.js")
      var page = parseInt(interaction.customId)
      const result = await teamschema.find()
            //10 results per page

            console.log(result)
            if (result) {
                var nothinInnit = false
                var t1 = ""; var t2 = ""; var t3 = ""; var t4 = ""; var t5 = ""; var t6 = ""; var t7 = ""; var t8 = ""; var t9 = ""; var t10 = "";
                var d1 = ""; var d2 = ""; var d3 = ""; var d4 = ""; var d5 = ""; var d6 = ""; var d7 = ""; var d8 = ""; var d9 = ""; var d10 = "";
                var c1 = ""; var c2 = ""; var c3 = ""; var c4 = ""; var c5 = ""; var c6 = ""; var c7 = ""; var c8 = ""; var c9 = ""; var c10 = "";
                try { var daresult = result[(page*10) - 10]; var a = daresult.teamName; var b = daresult.teamDesc; var c = daresult.teamShort; if (!a) {t1 = ""} else {t1 = a}; if (!b) {d1 = " "} else {console.log(b); d1 = b}; if (!c) {c1 = ""} else {c1 = c}; } catch(e) {console.log(e)}
                try { var daresult = result[(page*10) - 9]; var a = daresult.teamName; var b = daresult.teamDesc; var c = daresult.teamShort; if (!a) {t2 = ""} else {t2 = a}; if (!b) {d2 = " "} else {console.log(b); d2 = b}; if (!c) {c2 = ""} else {c2 = c}; }  catch(e) {console.log(e)}
                try { var daresult = result[(page*10) - 8]; var a = daresult.teamName; var b = daresult.teamDesc; var c = daresult.teamShort; if (!a) {t3 = ""} else {t3 = a}; if (!b) {d3 = " "} else {console.log(b); d3 = b}; if (!c) {c3 = ""} else {c3 = c}; }  catch(e) {console.log(e)}
                try { var daresult = result[(page*10) - 7]; var a = daresult.teamName; var b = daresult.teamDesc; var c = daresult.teamShort; if (!a) {t4 = ""} else {t4 = a}; if (!b) {d4 = " "} else {console.log(b); d4 = b}; if (!c) {c4 = ""} else {c4 = c}; }  catch(e) {console.log(e)}
                try { var daresult = result[(page*10) - 6]; var a = daresult.teamName; var b = daresult.teamDesc; var c = daresult.teamShort; if (!a) {t5 = ""} else {t5 = a}; if (!b) {d5 = " "} else {console.log(b); d5 = b}; if (!c) {c5 = ""} else {c5 = c}; }  catch(e) {console.log(e)}
                try { var daresult = result[(page*10) - 5]; var a = daresult.teamName; var b = daresult.teamDesc; var c = daresult.teamShort; if (!a) {t6 = ""} else {t6 = a}; if (!b) {d6 = " "} else {console.log(b); d6 = b}; if (!c) {c6 = ""} else {c6 = c}; }  catch(e) {console.log(e)}
                try { var daresult = result[(page*10) - 4]; var a = daresult.teamName; var b = daresult.teamDesc; var c = daresult.teamShort; if (!a) {t7 = ""} else {t7 = a}; if (!b) {d7 = " "} else {console.log(b); d7 = b}; if (!c) {c7 = ""} else {c7 = c}; }  catch(e) {console.log(e)}
                try { var daresult = result[(page*10) - 3]; var a = daresult.teamName; var b = daresult.teamDesc; var c = daresult.teamShort; if (!a) {t8 = ""} else {t8 = a}; if (!b) {d8 = " "} else {console.log(b); d8 = b}; if (!c) {c8 = ""} else {c8 = c}; }  catch(e) {console.log(e)}
                try { var daresult = result[(page*10) - 2]; var a = daresult.teamName; var b = daresult.teamDesc; var c = daresult.teamShort; if (!a) {t9 = ""} else {t9 = a}; if (!b) {d9 = " "} else {console.log(b); d9 = b}; if (!c) {c9 = ""} else {c9 = c}; }  catch(e) {console.log(e)}
                try { var daresult = result[(page*10) - 1]; var a = daresult.teamName; var b = daresult.teamDesc; var c = daresult.teamShort; if (!a) {t10 = ""} else {t10 = a}; if (!b) {d10 = " "} else {console.log(b); d10 = b}; if (!c) {c10 = ""} else {c10 = c}; } catch(e) {console.log(e)}
                const truncateText = function(txt, maxlength) {
                    if (!txt) return " "
                    if (txt.length > maxlength) {
                        return txt.substring(0, maxlength - 3)+"..."
                    } else {
                        return txt
                    }
                }
                const getpropertext = function(offset, string) {
                    if (!nothinInnit) {
                        if (!string) { if (offset == 10 && t1 == "") {nothingInnit = true; return "There is no clan data."} else {return " "} }
                        var currentmax = (page*10)
                        var num = 1+currentmax - offset
                        return "> "+num+" - "+string
                    }
                }
                const checkifpossible = function(offset) {
                    try {
                        if (result[(page*10)-offset].teamName) {return true} else {return false}
                    } catch(e) {
                        return false
                    }
                }
                const code = function(code) {
                  if (code) {return "\nCode: "+code} else {return ""}
              }
              var embed = new EmbedBuilder()
                  .setTitle("All clans (Page "+page+")")
                  .setDescription("Page "+page+": "+((page*10)-9)+"-"+(page*10))
                  .addFields(
                      {name: getpropertext(10, t1), value: truncateText(d1, 75)+code(c1)},
                      {name: getpropertext(9, t2), value: truncateText(d2, 75)+code(c2)},
                      {name: getpropertext(8, t3), value: truncateText(d3, 75)+code(c3)},
                      {name: getpropertext(7, t4), value: truncateText(d4, 75)+code(c4)},
                      {name: getpropertext(6, t5), value: truncateText(d5, 75)+code(c5)},
                      {name: getpropertext(5, t6), value: truncateText(d6, 75)+code(c6)},
                      {name: getpropertext(4, t7), value: truncateText(d7, 75)+code(c7)},
                      {name: getpropertext(3, t8), value: truncateText(d8, 75)+code(c8)},
                      {name: getpropertext(2, t9), value: truncateText(d9, 75)+code(c9)},
                      {name: getpropertext(1, t10), value: truncateText(d10, 75)+code(c10)},
                  )
                var leftdis = new ButtonBuilder()
                    .setCustomId("-goleftclanpage")
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel("⬅️")
                var rightdis = new ButtonBuilder()
                    .setCustomId("-gorightclanpage")
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel("➡️")
                var left = new ButtonBuilder()
                    .setCustomId((page-1)+"-goleftclanpage")
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel("⬅️")
                var right = new ButtonBuilder()
                    .setCustomId((page+1)+"-gorightclanpage")
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel("➡️")
                var leftchosen;
                var rightchosen;
                if (checkifpossible(11) == true) {leftchosen = left} else {leftchosen = leftdis}
                if (checkifpossible(0) == true) {rightchosen = right} else {rightchosen = rightdis}
                var row = new ActionRowBuilder()
                    .addComponents(leftchosen, rightchosen)
                interaction.reply({embeds: [embed], components: [row], ephemeral: true})
            } else {
                interaction.reply({embeds: [], components: [], content: "There was an error getting the team data.", ephemeral: true})
            }
    } else if (interaction.customId.includes("Verifywith-")) {
      const mcName = interaction.customId.split("-")[1]
      const userID = interaction.user.id
      const accepted = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle("Accepted!")
        .setAuthor({ name: interaction.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`})
        .setDescription("You have verified to __"+mcName+"__!")
        .setTimestamp()
      fetch(`https://api.mojang.com/users/profiles/minecraft/${mcName}`)
        .then(data => data.json())
        .then(async (player) => {
          console.log(player)
          const plrId = player.id
          try {
            const result = await plrSchema.findOneAndUpdate({
              userID
            }, {
              userID,
              minecraftName: mcName,
              minecraftUUID: plrId,
            }, {
              upsert: true,
              new: true
            })
          } catch(e) {
            console.log(e)
          }
          client.guilds.fetch(""+process.env.guildid) .then((guild) => {
            guild.members.fetch(""+interaction.user.id) .then(async (member) => {
              const role = guild.roles.cache.find(role => role.id == "1022631935614406730")
              await member.roles.add(role)
            })
          })
          interaction.message.edit({embeds: [accepted], components: [okrow]})
          interaction.deferUpdate()
      });
    } else if (interaction.customId.includes("Declinewith-")) {
      const mcName = interaction.customId.split("-")[1]
      const accepted = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle("Declined.")
        .setAuthor({ name: interaction.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`})
        .setDescription("You have declined to verify to __"+mcName+"__!")
        .setTimestamp()
      interaction.message.edit({embeds: [accepted], components: [okrow]})
    } else if (interaction.customId.includes("NoDMVW-")) {
      const args = interaction.customId.split("-")
      const mcName = args[2]
      const allegedUserID = interaction.user.id
      const realUserID = args[1]
      console.log(`NoDM Verify INFO:\n${allegedUserID} - interacted user\n${realUserID} - user in the button customID`)
      if (parseInt(realUserID) == parseInt(allegedUserID)) {
        const accepted = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle("Accepted!")
        .setAuthor({ name: interaction.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`})
        .setDescription("You have verified to __"+mcName+"__!")
        .setTimestamp()
      fetch(`https://api.mojang.com/users/profiles/minecraft/${mcName}`)
        .then(data => data.json())
        .then(async (player) => {
          console.log(player)
          const plrId = player.id
          const userID = interaction.user.id
          try {
            const result = await plrSchema.findOneAndUpdate({
              userID
            }, {
              userID,
              minecraftName: mcName,
              minecraftUUID: plrId,
            }, {
              upsert: true,
              new: true
            })
          } catch(e) {
            console.log(e)
          }
          interaction.message.edit({embeds: [accepted], components: [okrow]}) .then(() => {
            client.guilds.fetch(""+process.env.guildid) .then((guild) => {
              guild.members.fetch(""+interaction.user.id) .then(async (member) => {
                const role = guild.roles.cache.find(role => role.id == "1022631935614406730")
                await member.roles.add(role)
              })
            })
          })
          interaction.deferUpdate() 
        });
      } else {
        interaction.reply({content: "This is not your verification prompt!", ephemeral: true})
      }
     
    } else if (interaction.customId.includes("NoDMDW-")) {
      const args = interaction.customId.split("-")
      const mcName = args[2]
      const allegedUserID = interaction.user.id
      const realUserID = args[1]
      console.log(`NoDM Decline INFO:\n${allegedUserID} - interacted user\n${realUserID} - user in the button customID`)
      if (parseInt(realUserID) == parseInt(allegedUserID)) {
        const accepted = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle("Declined.")
          .setAuthor({ name: interaction.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`})
          .setDescription("You have declined to verify to __"+mcName+"__!")
          .setTimestamp()
        interaction.message.edit({embeds: [accepted], components: [okrow]}) .then(() => {
          setTimeout(() => {
            try {
              interaction.message.delete()
            } catch(e) {

            }
          }, 5000);
          
        })
      } else {
        interaction.reply({content: "This is not your verification prompt!", ephemeral: true})
      }
    }
  };
  if (interaction.isModalSubmit()) {
    if (interaction.customId == "ResetModal") {
      const textInp = interaction.fields.getTextInputValue("ModalTextInput")
      if (textInp == "unlink my accounts please.") {
        const userID = interaction.user.id
        const result = await plrSchema.findOneAndUpdate({
          userID
        }, {
          userID,
          minecraftUUID: "",
          minecraftName: "",
        }, {
          upsert: true,
          new: true
        })
        if (result) {
          client.guilds.fetch(""+process.env.guildid) .then((guild) => {
            guild.members.fetch(""+interaction.user.id) .then(async (member) => {
              try {
                const role = guild.roles.cache.find(role => role.id == "1022631935614406730")
                await member.roles.remove(role)
              } catch(e) {
                interaction.reply({content: "There was an error unlinking step 2. Please try again later.", ephemeral: true})
              }
            })
        })
          interaction.reply({content: "You have successfully unlinked.", ephemeral: true})
        } else {
          interaction.reply({content: "There was an error unlinking step 1. Please try again later.", ephemeral: true})
        }
      } else {
        interaction.reply({content: "You have not been unlinked, as you inputted "+textInp+"./nTo unlink, please type EXACTLY "+'"unlink my accounts please."'+" to properly unlink.", ephemeral: true})
      }
    }
  }
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
})
 
const verifyDiscordUser = async (data) => {
  let goneGood = true
  try {
    const args = (""+data.split("|")).split(",")
    const dcName = args[0]
    const dcTag = args[2]
    const mcName = args[1]

    console.log(data)
    console.log(dcName+"#"+dcTag+" has recieved a request from "+mcName+" to verify as them.")
    try {
      const user = client.users.cache.find(u => u.username === dcName)
      const findRes = await plrSchema.find({ userID: user.id })
      try {
        const lastVerificationTimestamp = findRes[0].lastVerificationTimestamp
        if (lastVerificationTimestamp + 300000 < Date.now()) { // 5 min verification time
          goneGood = false
          return false
        }
      } catch {}
      try {
        const accept = new ButtonBuilder()
          .setCustomId("Verifywith-"+mcName)
          .setLabel("Accept")
          .setStyle(ButtonStyle.Success)
        const decline = new ButtonBuilder()
          .setCustomId("Declinewith-"+mcName)
          .setLabel("Decline")
          .setStyle(ButtonStyle.Danger)
        const row = new ActionRowBuilder()
          .addComponents(accept, decline)
        const acceptNoDM = new ButtonBuilder()
          .setCustomId("NoDMVW-"+user.id+"-"+mcName)
          .setLabel("Accept")
          .setStyle(ButtonStyle.Success)
        const declineNoDM = new ButtonBuilder()
          .setCustomId("NoDMDW-"+user.id+"-"+mcName)
          .setLabel("Decline")
          .setStyle(ButtonStyle.Danger)
        const rowNoDM = new ActionRowBuilder()
          .addComponents(acceptNoDM, declineNoDM)
        const verify = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle("Verification")
            .setAuthor({ name: user.username, iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`})
            .setDescription("You were sent a verification request from __"+mcName+"__.\nWould you like to verify as this user?\nIf you decline, you will need to re-open verification.")
            .setTimestamp()
          const NoDMverify = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle("Verification")
            .setAuthor({ name: user.username, iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`})
            .setDescription("You were sent a verification request from __"+mcName+"__.\nWould you like to verify as this user?\nIf you decline, you will need to re-open verification.")
            .setFooter({text: "Request ends in 60s!"})
            .setTimestamp()
          user.send({embeds: [verify], components: [row]}) .then(async () => {
          try {
            const userID = user.id
            const result = await plrSchema.findOneAndUpdate({
              userID
            }, {
              userID,
              lastVerificationTimestamp: 0,
            }, {
              upsert: true,
              new: true
            })
          } catch(e) {
            console.log(e)
          }
          goneGood = true
        }) .catch((e) => {
          console.log("A User cannot verify using DMS!!!!!!!\n"+e)
          client.guilds.fetch(""+process.env.guildid) .then((guild) => {
            guild.channels.fetch("1025101523933466634") .then((channel) => {
              channel.send({content: "<@"+user.id+">", embeds: [NoDMverify], components: [rowNoDM]}) .then(async (msg) => {
                try {
                  const userID = user.id
                  const result = await plrSchema.findOneAndUpdate({
                    userID
                  }, {
                    userID,
                    lastVerificationTimestamp: 0,
                  }, {
                    upsert: true,
                    new: true
                  })
                } catch(e) {
                  console.log(e)
                }
                goneGood = true
                setTimeout(() => {
                  try {
                    msg.delete()
                  } catch(e) {
      
                  }
                  
                }, 60000);
              })
            })
          })
        })
          
      } catch(e) {}
    } catch(e) {
      console.log(e)
      goneGood = false
    }
  } catch(e) {
    console.log(e)
    goneGood = false
    return false
  }
  return goneGood
}

const getDataFromVerifiedUser = async (data) => {
  let goneGood = false
  let args = (""+data.split("=")).split(",")
  let mcName = args[1]
  return mcName
}
 
app.post('/link/mc-dc', async (req, res) => {
  const data = req.body.Data

  const isVerified = await verifyDiscordUser(data)
  if (isVerified) {
      res.send('Success')
  } else {
      res.status(400).send('Invalid Discord username')
  }
})

app.post('/getdata/dc-mc', async (req, res) => {
  const data = req.body.Data

  const gottenData = await getDataFromVerifiedUser(data)
  if (gottenData) {
      res.send('SUCCESS DATA: ')
  } else {
      res.status(400).send('User may not be verified.')
  }
})


client.login(process.env.token)