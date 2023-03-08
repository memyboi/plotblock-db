const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Gives you the current minecraft server info.')
		,
	async execute(interaction, client) {
		interaction.reply({content: "The minecraft server is currently 'non-existant'. This means the command will not work until the minecraft server is created. Sorry!", ephemeral: true})
	},
};