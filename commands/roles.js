const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('roles')
		.setDescription('Lists the roles of a user')
		.addUserOption(option => 
			option
				.setName("user")
				.setDescription("The user to list the roles of.")
				.setRequired(true)
			)
		.setDMPermission(false)
		,
	async execute(interaction, client) {
		var user = interaction.options.getUser("user")
		client.guilds.fetch(""+process.env.guildid) .then((guild) => {
			guild.members.fetch(""+user.id) .then((member) => {
				const memberRoles = member.roles.cache
				.filter((roles) => roles.id !== interaction.guild.id)
				.map((role) => role.toString());

				const exampleEmbed = new EmbedBuilder()
				.setAuthor({ name: user.username, iconURL: member.displayAvatarURL()})
				.setDescription(`${user.username}'s role(s) => ${memberRoles}`)
				.setColor("#ff0000")
				
				interaction.reply({embeds: [exampleEmbed], ephemeral: true});
			})
		})

		
	},
};