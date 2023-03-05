const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('party')
		.setDescription('Show or edit your party')
		.addSubcommand(subcommand =>
			subcommand
				.setName('show')
				.setDescription('Shows your entire party')
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('edit')
				.setDescription('Edit your party')
				.addStringOption(option =>
					option
						.setName('order')
						.setDescription('Edit the order  of your party')
						.setRequired(true)
						)
		),
	async execute(interaction, client) {
		
		if (interaction.options.getSubcommand() == "show") {
			const xpSchema = require('../schema.js')
			const findRes = await xpSchema.find({ userID: interaction.user.id })
			try {
				let users = []
				let blocked = findRes[0].blocked
				blocked.forEach(element => {
					let user = client.users.cache.get(""+element);
					users.push(user.tag)
				})
				const blockedusers = users
					.map((role) => role.toString());
				const exampleEmbed = new EmbedBuilder()
					.setAuthor({ name: interaction.user.username})
					.setDescription(`These are the people you have blocked:\n${blockedusers}`)
					.setColor("#ff0000")
				interaction.reply({embeds: [exampleEmbed], ephemeral: true})
			} catch(e) {
				console.log(e);
				interaction.reply({content: "Your blocked users data is unnaccessable, try blocking someone first!", ephemeral: true})
			}
		} else {
			interaction.reply({content:"This command is WIP!", ephemeral: true})
		}
	},
};