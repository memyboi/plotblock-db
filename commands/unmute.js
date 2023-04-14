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
	async execute(interaction, client) {
		var user = interaction.options.getUser("user")

		client.guilds.fetch(""+process.env.guildid) .then((guild) => {
			var role = guild.roles.cache.find(role => role.id == "1084533678849392731")
			var talkingrole = guild.roles.cache.find(role => role.id == "1084582068316549252")
			guild.members.fetch(""+user.id) .then((member) => {
				if (member.roles.cache.some(role => role.id == "1084533678849392731") && !member.roles.cache.some(role => role.id == "1084582068316549252")) {
					//muted, unmute
					member.roles.remove(role)
					member.roles.add(talkingrole)
					interaction.reply({content: "User has been unmuted.", ephemeral: true})
					user.send({content: "*You have been unmuted by `"+interaction.user.username+"` from Plot Block [LIFESTEAL]!*\nPlease do re-read the rules so you do not get punished again."})
				} else {
					interaction.reply({content: "This user may be not muted!", ephemeral: true})
				}
			})
		})
	},
};