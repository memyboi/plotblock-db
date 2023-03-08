const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const helpEmbed = new EmbedBuilder()
	.setColor('#ff0000')
	.setTitle("Command help:")
	.setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`})
	.setDescription('Do ' + prefix + "help [1-4] for info about me!")
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
	.setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`})
	.setDescription('' + prefix + "help page 1 | Generic commands")
	.addFields(
	{ name: prefix + client.commands.get('roles').name, value: client.commands.get('roles').description, inline: true },
	{ name: prefix + client.commands.get('serverinfo').name, value: client.commands.get('serverinfo').description, inline: true },
	)
	.setTimestamp()

const helpEmbed2 = new EmbedBuilder()
	.setColor('#ff0000')
	.setTitle("Team commands help:")
	.setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`})
	.setDescription('' + prefix + "help page 2 | Team commands")
	.addFields(
	{ name: prefix + client.commands.get('join').name, value: client.commands.get('join').description, inline: true },
	{ name: prefix + client.commands.get('leave').name, value: client.commands.get('leave').description, inline: true },
	{ name: prefix + client.commands.get('kick').name, value: client.commands.get('kick').description, inline: true },
	)
	.setTimestamp()

const helpEmbed3 = new EmbedBuilder()
	.setColor('#ff0000')
	.setTitle("Admin commands help:")
	.setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`})
	.setDescription('' + prefix + "help page 3 | Admin commands")
	.addFields(
	{ name: prefix + client.commands.get('kickfs').name, value: client.commands.get('kickfs').description, inline: true },
	{ name: prefix + client.commands.get('banfs').name, value: client.commands.get('banfs').description, inline: true },
	{ name: prefix + client.commands.get('unbanfs').name, value: client.commands.get('unbanfs').description, inline: true },
	{ name: prefix + client.commands.get('warn').name, value: client.commands.get('warn').description, inline: true },
	{ name: prefix + client.commands.get('clear').name, value: client.commands.get('clear').description, inline: true },
	)
	.setTimestamp()

const helpEmbed4 = new EmbedBuilder()
	.setColor('#ff0000')
	.setTitle("Info help:")
	.setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`})
	.setDescription('' + prefix + "help page 4")
	.addFields(
	{ name: "Who created me?", value: "DeadFry42#5445", inline: true },
	{ name: "What is my purpose?", value: "My purpose is to keep the server's teams organised and to do other stuff related to this server.", inline: true },
	)
	.setTimestamp()

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
		var page = interaction.options.getNumber("page")
		if (page) {
			if (page==1) interaction.reply({embeds: [helpEmbed1]})
			if (page==2) interaction.reply({embeds: [helpEmbed2]})
			if (page==3) interaction.reply({embeds: [helpEmbed3]})
			if (page==4) interaction.reply({embeds: [helpEmbed4]})
		} else {
			interaction.reply({embeds: [helpEmbed]})
		}
	},
};