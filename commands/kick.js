const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kicks a player for a reason.')
		.addUserOption(option => 
			option
				.setName("user")
				.setDescription("The user to kick.")
				.setRequired(true)
			)
		.addStringOption(option => 
			option
				.setName("reason")
				.setDescription("The reason to kick this user.")
			)
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.setDMPermission(false)//uwu
		,
	async execute(interaction, client) {
		var user = interaction.options.getUser("user")
		var reason = interaction.options.getString("reason")
		if (!reason) {
			console.log("aauudhdhdhdhdhdhdhdhdhdhdhedhasdfsdf")
			user.send({
				content: "***You have been kicked by `"+interaction.user.username+"` from Plot Block [LIFESTEAL]!***\nThere is no reason given for such an outlandish action.\nYou can rejoin using the link you have used previously, if it is still active."
			}) .then(() => {
				console.log("AAAAAE")
				client.guilds.fetch(""+process.env.guildid) .then((guild) => {
					guild.members.fetch((member) => {
						console.log("uwuwuwuwwu2")
						member.kick("No reason given by the moderator.")
						interaction.reply({content: "User has been kicked. No reason given.", ephemeral: true})
					})
				})
			}) .catch(() => {
				console.log("AAAAsAE")
				client.guilds.fetch(""+process.env.guildid) .then((guild) => {
					guild.members.fetch((member) => {
						console.log("uwuwuwuwwu22")
						member.kick("No reason given by the moderator. User has not been able to receive the message.")
						interaction.reply({content: "User has been kicked, however they were unable to receive the message in DMs.", ephemeral: true})
					})
				})
			})
		} else {
			user.send({
				content: "***You have been kicked by `"+interaction.user.username+"` from Plot Block [LIFESTEAL]!***\nThe reason given is: \n```"+reason+"```\nYou can rejoin using the link you have used previously, if it is still active."
			}) .then(() => {
				console.log("AAAAssAE")
				client.guilds.fetch(""+process.env.guildid) .then((guild) => {
					guild.members.fetch((member) => {
						console.log("uwuwuwuwwu222")
						member.kick(reason)
						interaction.reply({content: "User has been kicked. Reason has been given:\n```"+reason+"```", ephemeral: true})
						
					})
				})
			}) .catch(() => {
				console.log("AAAAsssAE")
				client.guilds.fetch(""+process.env.guildid) .then((guild) => {
					guild.members.fetch((member) => {
						console.log("uwuwuwuwwu2222")
						member.kick("No reason given by the moderator. User has not been able to receive the message.")
						interaction.reply({content: "User has been kicked, however they were unable to receive the message in DMs.", ephemeral: true})
					})
				})
			})
		}
		
	},
};