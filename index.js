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

const prefix = '?';

client.on("messageCreate", async message => {
  if (message.content.toLowerCase().startsWith(prefix) && !message.author.bot) {
    let args = message.content.substring(prefix.length).toLowerCase().split(" ")

    switch(args[0]){
      case 'roles':
        client.commands.get('roles').execute(message, args, client);
      break;
        
      case 'help':
        const helpEmbed = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle("Command help:")
          .setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`})
          .setDescription('Do ' + prefix + "help [1-2] for info about me!")
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

client.on("ready", async () => {
  console.log("ready and on")
  client.user.setActivity(prefix + 'help for help', { type: ActivityType.Playing })
})


client.login(process.env.token)