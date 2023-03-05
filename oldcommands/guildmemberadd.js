var manual = false

const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ActivityType, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'guildmemberadd',
  description: 'Runs upon a guild member being added',
  execute(member, client){
    if (manual) {
        member.send("Welcome to the Plot Block [LIFESTEAL] server!\nAt this time, you must be manually verified by an admin to play the server.\nThe admin will send you a TOS and in order to be verified, you must read and accept it.")
    } else {
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('tos')
            .setLabel('View TOS')
            .setStyle(ButtonStyle.Secondary),
        )
      
      member.send(
      {
          content: "Welcome to the Plot Block [LIFESTEAL] server!\nPlease read the short TOS and accept to be verified.",
          components: [row]
      })
    }
  }
}