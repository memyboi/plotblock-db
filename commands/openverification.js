const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('openverification')
		.setDescription('Open up verification for 5 minutes')
		.setDMPermission(false)
		,
	async execute(interaction, client) {interaction.deferReply({ephemeral: true})
		var user = interaction.user
		client.guilds.fetch(""+process.env.guildid) .then((guild) => {
			guild.members.fetch(""+user.id) .then(async (member) => {
				if (member.roles.cache.some(role => role.id === "1022631935614406730")) {
					interaction.editReply({content: "You are already verified!", ephemeral: true})
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
									interaction.editReply({content: "You already have a verified minecraft account ("+mcname+")!", ephemeral: true})
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
							interaction.editReply({content: "Verification for your account has opened for 5 minutes!", ephemeral: true})
						}
					} catch(e) {
						try {
							const userID = user.id
							const result = await plrSchema.findOneAndUpdate({
								userID
							}, {
								userID,
								lastVerificationTimestamp: Date.now()
							}, {
								upsert: true,
								new: true
							})
							interaction.editReply({content: "Verification for your account has opened for 5 minutes!", ephemeral: true})
						} catch(e2) {
							interaction.editReply({content: "Opening verification has failed!\nPlease report this to a developer, as there may be an issue with the database."})
							console.log(`Error while opening verification. Error 1 (fail mcuuid check):\n${e}\nError 2 (fail add lat):\n${e2}`)
						}
					}
				}
			})
		})
	},
};