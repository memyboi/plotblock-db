const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clear an amount of messages')
		.addNumberOption(option => 
			option
				.setName("amount")
				.setDescription("The amount of messages to clear")
				.setRequired(true)
			)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.setDMPermission(false)
		,
	async execute(interaction, client) {
		var amnt = parseInt(interaction.options.getNumber("amount"))
		interaction.channel.bulkDelete(amnt)
		interaction.reply({content:amnt+" message(s) have been cleared!", ephemeral: true})
	},
};