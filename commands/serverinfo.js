const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Gives you the current minecraft server info.')
		,
	async execute(interaction, client) {
		interaction.reply({content: "The minecraft server has been created, but currently the server is not available outside of verification. The live map is available by running </livemap:1096754378012119040>.\nFor verification, you will need to join the server at __plotblock.my.pebble.host__ and follow the (summarised) instructions in <#1025101523933466634>.", ephemeral: true})
	},
};