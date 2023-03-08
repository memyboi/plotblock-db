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
			user.send({content: "***You have been kicked by `"+interaction.user.username+"` from Plot Block [LIFESTEAL]!***\nThere is no reason given for such an outlandish action.\nYou can rejoin using the link you have used previously, if it is still active."}
			) .then(() => {
				client.guilds.fetch(""+process.env.guildid) .then((guild) => {
					guild.members.fetch((member) => {
						member.kick("No reason given by the moderator.") .then(() => {
							interaction.reply({content: "User has been kicked. No reason given.", ephemeral: true})
						}) .catch((e) => {
							interaction.reply({content: "There was an error when kicking the user.\nError dump:\n```"+e+"```", ephemeral: true})
						})
					})
				})
			}) .catch(() => {
				client.guilds.fetch(""+process.env.guildid) .then((guild) => {
					guild.members.fetch((member) => {
						member.kick("No reason given by the moderator. User has not been able to receive the message.") .then(() => {
							interaction.reply({content: "User has been kicked, however they were unable to receive the message in DMs.", ephemeral: true})
						}) .catch((e) => {
							interaction.reply({content: "There was an error when kicking the user.\nError dump:\n```"+e+"```", ephemeral: true})
						})
					})
				})
			})
		} else {
			user.send({content: "***You have been kicked by `"+interaction.user.username+"` from Plot Block [LIFESTEAL]!***\nThe reason given is: \n```"+reason+"```\nYou can rejoin using the link you have used previously, if it is still active."}
			) .then(() => {
				client.guilds.fetch(""+process.env.guildid) .then((guild) => {
					guild.members.fetch((member) => {
						member.kick(reason) .then(() => {
							interaction.reply({content: "User has been kicked. Reason has been given:\n```"+reason+"```", ephemeral: true})
						}) .catch((e) => {
							interaction.reply({content: "There was an error when kicking the user.\nError dump:\n```"+e+"```", ephemeral: true})
						})
					})
				})
			}) .catch(() => {
				client.guilds.fetch(""+process.env.guildid) .then((guild) => {
					guild.members.fetch((member) => {
						member.kick("No reason given by the moderator. User has not been able to receive the message.") .then(() => {
							interaction.reply({content: "User has been kicked, however they were unable to receive the message in DMs.", ephemeral: true})
						}) .catch((e) => {
							interaction.reply({content: "There was an error when kicking the user.\nError dump:\n```"+e+"```", ephemeral: true})
						})
					})
				})
			})
		}
		
	},
};