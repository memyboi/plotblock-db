const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('openverification')
		.setDescription('Open up verification for 5 minutes')
		.setDMPermission(false)
		,
	async execute(interaction, client) {
		var user = interaction.user
		client.guilds.fetch(""+process.env.guildid) .then((guild) => {
			guild.members.fetch(""+user.id) .then(async (member) => {
				if (member.roles.cache.some(role => role.id === "1022631935614406730")) {
					interaction.reply({content: "You are already verified!", ephemeral: true})
				} else {
					const plrSchema = require("../schema.js")
					const findRes = await plrSchema.find({ userID: user.id })
					try {
						let mcname = "None!" //findRes[0].minecraftUUID (processing needed, https://api.mojang.com/user/profile/)
						if (findRes[0].minecraftUUID) {
							fetch("https://api.mojang.com/user/profile/"+findRes[0].minecraftUUID)
								.then(data => data.json())
								.then(async (player) => {
									mcname = player.name
									interaction.reply({content: "You already have a verified minecraft account ("+mcname+")!", ephemeral: true})
									try {
										const verifyRole = guild.roles.cache.find(role => role.id === "1022631935614406730")
										await member.roles.add(verifyRole)
									} catch {}
								}) .catch((e) => {

								})
						} else {
							const userID = user.id
							try {
								const result = await plrSchema.findOneAndUpdate({
									userID
								}, {
									userID,
									lastVerificationTimestamp: Date.now()
								}, {
									upsert: true,
									new: true
								})
							} catch(e) {
								console.log(e)
							}
							interaction.reply({content: "Verification for your account has opened for 5 minutes!", ephemeral: true})
						}
					} catch(e) {
						console.log("There was an error while opening up verification..")
					}
					
				}
			})
		})
	},
};