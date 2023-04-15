const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('livemap')
		.setDescription('Gives you a link to the live map')
		.setDMPermission(false)
		,
	async execute(interaction, client) {
		interaction.reply({content: "The livemap is available (here)[http://plotblock.my.pebble.host:8127/#].", ephemeral: true})
	},
};