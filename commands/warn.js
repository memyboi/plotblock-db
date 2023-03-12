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
		.setName('warn')
		.setDescription('Warn a user for a reason.')
		.addUserOption(option => 
			option
				.setName("user")
				.setDescription("The user to warn.")
				.setRequired(true)
			)
		.addStringOption(option => 
			option
				.setName("reason")
				.setDescription("The reason to warn this user.")
			)
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.setDMPermission(false)
		,
	async execute(interaction, client) {
		var user = interaction.options.getUser("user")
		var reason = interaction.options.getString("reason")
		
		if (!reason) {
			user.send({content: "*You have been warned by `"+interaction.user.username+"` from Plot Block [LIFESTEAL]!*\nThere is no reason given for such an outlandish action.\nPlease refrain from breaking the rules once more. If you feel you are not familiar with the rules, please re-read the rules."})
			interaction.reply({content: "User has been warned. No reason given.", ephemeral: true})
		} else {
			user.send({content: "*You have been warned by `"+interaction.user.username+"` from Plot Block [LIFESTEAL]!*\nThe reason given is: \n```"+reason+"```\nPlease refrain from breaking the rules once more. If you feel you are not familiar with the rules, please re-read the rules."})
			interaction.reply({content: "User has been warned. Reason has been given:\n```"+reason+"```", ephemeral: true})
		}
		const userID = user.id
		const plrSchema = require("../schema.js")
		const id = (new Date()).getTime()
		if (!reason) reason = "There is no reason."
		try {
			const result = await plrSchema.findOneAndUpdate({
				userID
			}, {
				userID,
				$addToSet: {
					warns: new warn(
						reason,
						id,
						"UTC+00 s/mi/h/d/mo/y: "+(new Date()).getUTCSeconds()+":"+(new Date()).getUTCMinutes()+":"+(new Date()).getUTCHours()+":"+(new Date()).getDay()+":"+(new Date()).getUTCMonth()+":"+(new Date()).getUTCFullYear()
					)
				}
			}, {
				upsert: true,
				new: true
			})
			console.log(result)
		} catch(e) {
			console.log(e)
		}
	},
};