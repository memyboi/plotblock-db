const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans a player for a reason.')
		.addUserOption(option => 
			option
				.setName("user")
				.setDescription("The user to ban.")
				.setRequired(true)
			)
		.addBooleanOption(option => 
			option
				.setName("appealable")
				.setDescription("Is this ban able to be appealed?")
				.setRequired(true)
			)
		.addStringOption(option => 
			option
				.setName("reason")
				.setDescription("The reason to ban this user.")
			)
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setDMPermission(false)//uwu
		,
	async execute(interaction, client) {
		var user = interaction.options.getUser("user")
		var reason = interaction.options.getString("reason")
		var appealable = interaction.options.getBoolean("appealable")
		if (!reason) {
			console.log("aauudhdhdhdhdhdhdhdhdhdhdhedhasdfsdf")
			if (appealable) {
				user.send({
					content: "***You have been __banned__ by `"+interaction.user.username+"` from Plot Block [LIFESTEAL]!***\nThere is no reason given for such an outlandish action.\nYou can appeal if you think your ban was unfair at: https://discord.gg/MQzDm6KDsH"
				}) .then(() => {
					client.guilds.fetch(""+process.env.guildid) .then((guild) => {
						guild.members.fetch(""+user.id) .then((member) => {
							user.ban("No reason given by the moderator.")
							interaction.reply({content: "User has been banned. No reason given.", ephemeral: true})
						})
					})
				}) .catch(() => {
					client.guilds.fetch(""+process.env.guildid) .then((guild) => {
						guild.members.fetch(""+user.id) .then((member) => {
							user.ban("No reason given by the moderator. User has not been able to receive the message.")
							interaction.reply({content: "User has been banned, however they were unable to receive the message in DMs.", ephemeral: true})
						})
					})
				})
			} else {
				user.send({
					content: "***You have been __banned__ by `"+interaction.user.username+"` from Plot Block [LIFESTEAL]!***\nThere is no reason given for such an outlandish action.\nThe moderator has stated that your ban is unappealable."
				}) .then(() => {
					client.guilds.fetch(""+process.env.guildid) .then((guild) => {
						guild.members.fetch(""+user.id) .then((member) => {
							user.ban("No reason given by the moderator.")
							interaction.reply({content: "User has been banned. No reason given.", ephemeral: true})
						})
					})
				}) .catch(() => {
					client.guilds.fetch(""+process.env.guildid) .then((guild) => {
						guild.members.fetch(""+user.id) .then((member) => {
							user.ban("No reason given by the moderator. User has not been able to receive the message.")
							interaction.reply({content: "User has been banned, however they were unable to receive the message in DMs.", ephemeral: true})
						})
					})
				})
			}
			
		} else {
			console.log("aauudhdhdhdhdhdhdhdhdhdhdhedhasdfsdf2222222222222")
			if (appealable) {
				user.send({
					content: "***You have been __banned__ by `"+interaction.user.username+"` from Plot Block [LIFESTEAL]!***\nThe reason given is: \n```"+reason+"```\nYou can appeal if you think your ban was unfair at: https://discord.gg/MQzDm6KDsH"
				}) .then(() => {
					client.guilds.fetch(""+process.env.guildid) .then((guild) => {
						guild.members.fetch(""+user.id) .then((member) => {
							user.ban(reason)
							interaction.reply({content: "User has been banned. Reason has been given:\n```"+reason+"```", ephemeral: true})
						})
					})
				}) .catch(() => {
					client.guilds.fetch(""+process.env.guildid) .then((guild) => {
						guild.members.fetch(""+user.id) .then((member) => {
							user.ban("No reason given by the moderator. User has not been able to receive the message.")
							interaction.reply({content: "User has been banned, however they were unable to receive the message in DMs.", ephemeral: true})
						})
					})
				})
			} else {
				user.send({
					content: "***You have been __banned__ by `"+interaction.user.username+"` from Plot Block [LIFESTEAL]!***\nThe reason given is: \n```"+reason+"```\nThe moderator has stated that your ban is unappealable."
				}) .then(() => {
					client.guilds.fetch(""+process.env.guildid) .then((guild) => {
						guild.members.fetch(""+user.id) .then((member) => {
							user.ban(reason)
							interaction.reply({content: "User has been banned. Reason has been given:\n```"+reason+"```", ephemeral: true})
						})
					})
				}) .catch(() => {
					client.guilds.fetch(""+process.env.guildid) .then((guild) => {
						guild.members.fetch(""+user.id) .then((member) => {
							user.ban("No reason given by the moderator. User has not been able to receive the message.")
					interaction.reply({content: "User has been banned, however they were unable to receive the message in DMs.", ephemeral: true})
						})
					})
				})
			}
		}
	},
};