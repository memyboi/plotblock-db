const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
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
				let teamname = "null"
				let cash = "null"
				let xp = "null"
				let lvls = "null"
				let mcname = ""
				const memberRoles = member.roles.cache
				.filter((roles) => roles.id !== interaction.guild.id)
				.map((role) => role.toString());

				const exampleEmbed = new EmbedBuilder()
				.setAuthor({ name: user.username, iconURL: member.displayAvatarURL()})
				.setDescription(`${user.username}'s information:\n> minecraft name => ${mcname}\n> roles => ${memberRoles}\n> team => ${teamname}\n> cash => ${cash}\n> xp => ${xp}\n> lvls => ${lvls}`)
				.setColor("#ff0000")
				
				interaction.reply({embeds: [exampleEmbed], ephemeral: true});
			})
		})

		
	},
};