const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get help on certain topics')
		.addNumberOption(option =>
			option
				.setName("page")
				.setDescription("The page of the help command that you view.")
				.setMaxValue(4)
				.setMinValue(1)
		)
		,
	async execute(interaction, client) {
		const helpEmbed = new EmbedBuilder()
			.setColor('#ff0000')
			.setTitle("Help help:")
			.setAuthor({ name: interaction.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`})
			.setDescription('Do /help [1-4] for info about me!')
			.addFields(
			{ name: "Page 1", value: "Generic commands", inline: true },
			{ name: "Page 2", value: "Team commands", inline: true },
			{ name: "Page 1", value: "Admin commands", inline: true },
			{ name: "Page 4", value: "Bot info", inline: true },
			)
			.setTimestamp()
		const helpEmbed1 = new EmbedBuilder()
			.setColor('#ff0000')
			.setTitle("Generic commands help:")
			.setAuthor({ name: interaction.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`})
			.setDescription("/help page 1 | Generic commands")
			.addFields(
			{ name: "/userinfo", value: "Gives you the basic rundown of someones current statistics/situation.", inline: true },
			{ name: "/serverinfo", value: "Gives you the basic rundown of the servers information", inline: true },
			)
			.setTimestamp()

		const helpEmbed2 = new EmbedBuilder()
			.setColor('#ff0000')
			.setTitle("Team commands help:")
			.setAuthor({ name: interaction.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`})
			.setDescription("/help page 2 | Team commands")
			.addFields(
			{ name: "/clan", value: "WIP", inline: true },
			)
			.setTimestamp()

		const helpEmbed3 = new EmbedBuilder()
			.setColor('#ff0000')
			.setTitle("Admin commands help:")
			.setAuthor({ name: interaction.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`})
			.setDescription("/help page 3 | Admin commands")
			.addFields(
			{ name: "/kick", value: "Kicks a user from the server. A reason can be provided.", inline: true },
			{ name: "/ban", value: "Bans a user from the server. A reason can be provided and the ban can be set to 'unappealable'", inline: true },
			{ name: "/warn", value: "Warns a user for misbehaving. A reason can be provided.", inline: true },
			{ name: "/clear", value: "Clears an amount of messages that is provided.", inline: true },
			{ name: "/mute", value: "Mutes a user for a reason and an optional amount of time.", inline: true },
			{ name: "/unmute", value: "Unmutes a user.", inline: true },
			)
			.setTimestamp()

		const helpEmbed4 = new EmbedBuilder()
			.setColor('#ff0000')
			.setTitle("Info help:")
			.setAuthor({ name: interaction.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`})
			.setDescription("/help page 4")
			.addFields(
			{ name: "Who created me?", value: "DeadFry42#5445", inline: true },
			{ name: "What is my purpose?", value: "My purpose is to keep the server's teams organised and to do other stuff related to this server.", inline: true },
			)
			.setTimestamp()
		var page = interaction.options.getNumber("page")
		if (page) {
			if (page==1) interaction.reply({embeds: [helpEmbed1], ephemeral: true})
			if (page==2) interaction.reply({embeds: [helpEmbed2], ephemeral: true})
			if (page==3) interaction.reply({embeds: [helpEmbed3], ephemeral: true})
			if (page==4) interaction.reply({embeds: [helpEmbed4], ephemeral: true})
		} else {
			interaction.reply({embeds: [helpEmbed], ephemeral: true})
		}
	},
};