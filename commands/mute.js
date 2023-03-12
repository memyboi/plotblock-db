const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

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
		.setName('mute')
		.setDescription('Mute a user for a reason.')
		.addUserOption(option => 
			option
				.setName("user")
				.setDescription("The user to mute.")
				.setRequired(true)
			)
		.addStringOption(option => 
			option
				.setName("reason")
				.setDescription("The reason to mute this user.")
			)
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.setDMPermission(false)
		,
	async execute(interaction, client) {
		var user = interaction.options.getUser("user")
		var reason = interaction.options.getString("reason")
		
		client.guilds.fetch(""+process.env.guildid) .then((guild) => {
			var role = guild.roles.cache.find(role => role.id == "1084533678849392731")
			guild.members.fetch(""+user.id) .then((member) => {
				member.roles.add(role)
				interaction.reply("This user has been muted.")
			})
		})
	},
};