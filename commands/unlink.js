const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('unlink')
		.setDescription('Remove your linked minecraft account.')
		.setDMPermission(false)
		,
	async execute(interaction, client) {
		client.guilds.fetch(""+process.env.guildid) .then((guild) => {
            guild.members.fetch(""+interaction.user.id) .then(async (member) => {
                if (member.roles.cache.some(role => role.id == "1022631935614406730")) {
					const plrSchema = require("../schema.js")
					const findres = await plrSchema.find({ userID: interaction.user.id })
					try {
						if (findres[0].minecraftUUID != "" && typeof findres[0] != undefined) {
							const button = new ButtonBuilder()
								.setLabel("Yes.")
								.setStyle(ButtonStyle.Danger)
								.setCustomId("RESETALLDATA")
							const button2 = new ButtonBuilder()
								.setLabel("No.")
								.setStyle(ButtonStyle.Success)
								.setCustomId("doNotResetLmao")
							const row = new ActionRowBuilder()
								.addComponents(button2, button)
							interaction.reply({content: "Are you sure you would like to unlink?\nThere will be a pop-up that gives you more detail if you press Yes.", ephemeral: true, components: [row]})
						}
					} catch(e) {
						console.log(e)
						interaction.reply({content: "Your data is unavailable!", ephemeral: true})
					}
                } else {
                    interaction.reply({content: "You must have a verified role to unlink!", ephemeral: true})
                }
            })
        })
	},
};