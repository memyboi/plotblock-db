const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require("ms");

let warn = class {
    constructor(
        reason,
		id,
		timestamp
        ) {

        this.reason = reason
		this.timestamp = timestamp
		this.id = id
      }
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Unmute a user for a reason.')
		.addUserOption(option => 
			option
				.setName("user")
				.setDescription("The user to unmute.")
				.setRequired(true)
			)
		.setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
		.setDMPermission(false)
		,
	async execute(interaction, client) {interaction.deferReply({ephemeral: true})
		var user = interaction.options.getUser("user")

		client.guilds.fetch(""+process.env.guildid) .then((guild) => {
			var role = guild.roles.cache.find(role => role.id == "1084533678849392731")
			var talkingrole = guild.roles.cache.find(role => role.id == "1084582068316549252")
			guild.members.fetch(""+user.id) .then(async (member) => {
				if (member.roles.cache.some(role => role.id == "1084533678849392731") || !member.roles.cache.some(role => role.id == "1084582068316549252")) {
					try {
						//muted, unmute
						await member.roles.remove(role)
						await member.roles.add(talkingrole)
						interaction.editReply({content: "User has been unmuted.", ephemeral: true})
						user.send({content: "*You have been unmuted by `"+interaction.user.username+"` from Plot Block [LIFESTEAL]!*\nPlease do re-read the rules so you do not get punished again."})
					} catch(e) {
						interaction.editReply({content: "There was an error unmuting this user!", ephemeral: true})
					}
					
				} else {
					interaction.editReply({content: "This user may be not muted!", ephemeral: true})
				}
			})
		})
	},
};