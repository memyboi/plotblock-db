const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Gives you the current minecraft server info.')
		,
	async execute(interaction, client) {
		client.guilds.fetch(""+process.env.guildid) .then((guild) => {
            guild.members.fetch(""+interaction.user.id) .then((member) => {
                if (member.roles.cache.some(role => role.id == "1022631935614406730")) {
                    interaction.reply({content: "The minecraft server has been created, but currently the server is not available outside of verification. The live map is available by running </livemap:1096754378012119040>.", ephemeral: true})
                } else {
                    interaction.reply({content: "You must verify in order to run this command!", ephemeral: true})
                }
            })
        })
	},
};