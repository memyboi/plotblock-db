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
			guild.members.fetch(""+user.id) .then(async (member) => {
				const plrSchema = require("../schema.js")
				const findRes = await plrSchema.find({ userID: user.id })
				try {
					let teamname = "null"
					let cash = findRes[0].cash
					let xp = findRes[0].xp
					let lvls = findRes[0].lvls
					let mcname = "null"
					
					const memberRoles = member.roles.cache
						.filter((roles) => roles.id !== interaction.guild.id)
						.map((role) => role.toString());

					const exampleEmbed = new EmbedBuilder()
						.setAuthor({ name: user.username, iconURL: member.displayAvatarURL()})
						.setDescription(`${user.username}'s information:\n> minecraft name => ${mcname}\n> team => ${teamname}\n> cash => ${cash}\n> xp => ${xp}\n> lvls => ${lvls}\n> roles => ${memberRoles}`)
						.setColor("#ff0000")
					
					interaction.reply({embeds: [exampleEmbed], ephemeral: true});
				} catch(e) {
					console.log(e)
					interaction.reply({content: user.username+" does not have any user data!", ephemeral: true});
				}
			})
		})

		
	},
};