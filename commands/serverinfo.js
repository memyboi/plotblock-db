const talkedRecently = new Set();
const commandDelay = 1 //seconds 

const { EmbedBuilder } = require('discord.js')
const util = require("minecraft-server-util")

module.exports = {
  name: 'serverinfo',
  description: 'Shows info about the minecraft server.',
  execute(message, args, client){
    if (talkedRecently.has(message.author.id)) {
      message.channel.send("Please wait " + commandDelay + " second(s) until you can use this command again");
    } else {
      if (message.guild == null) return message.reply("You cannot do this command in DMs.");
      if (!message.guild.members.cache.get(message.author.id).roles.cache.some(role => role.name === 'ModPerms')) return message.reply("You do not have the permission to do this command!")
      
      util.status("plotblockls.minehut.gg", 25565) .then((response) => {
        const responseToUser = new EmbedBuilder()
          .setColor('#8FCDE8')
          .setTitle("Status of Minecraft Server:")
          .addFields(
            {name: "Online Players", value: response.onlinePlayers + "/" + response.maxPlayers},
            {name: "Required version", value: response.version}
          )

        message.reply({embeds: [responseToUser]})
      }) .catch((err) => {
        message.reply("The server is currently unresponsive.")
        console.log(err)
      })

      talkedRecently.add(message.author.id);
      setTimeout(() => {
        // Removes the user from the set after a minute
        talkedRecently.delete(message.author.id);
      }, commandDelay * 1000);
    }
  }
}