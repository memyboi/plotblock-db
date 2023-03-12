const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require("ms");

let mute = class {
    constructor(
        reason,
		length,
		id,
		timestamp
        ) {

        this.reason = reason
		this.timestamp = timestamp
		this.id = id
		this.length = length
      }
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Mute a user for a reason.')
		.addUserOption(option => 
			option
				.setName("user")
				.setDescription("The user to mute.")
				.setRequired(true)
			)
		.addStringOption(option => 
			option
				.setName("reason")
				.setDescription("The reason to mute this user.")
			)
		.addStringOption(option => 
			option
				.setName("time")
				.setDescription("The amount of time that the member should be muted for.")
			)
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.setDMPermission(false)
		,
	async execute(interaction, client) {
		var user = interaction.options.getUser("user")
		var reason = interaction.options.getString("reason")
		var length = interaction.options.getString("time")

		if (!ms(ms(length)) && length) return interaction.reply({content:"You have inputted an invalid amount of time!"}) 
		
		client.guilds.fetch(""+process.env.guildid) .then((guild) => {
			var role = guild.roles.cache.find(role => role.id == "1084533678849392731")
			var talkingrole = guild.roles.cache.find(role => role.id == "1084582068316549252")
			guild.members.fetch(""+user.id) .then((member) => {
				if (length) {
					var timeout = ms(length)
					if (!member.roles.cache.some(role => role.id == "1084533678849392731") && member.roles.cache.some(role => role.id = "1084582068316549252")) {
						//not muted, mute
						member.roles.remove(talkingrole)
						member.roles.add(role)
						if (reason) {
							interaction.reply({content: "User has been muted for "+ms(ms(length))+". Reason has been given:\n```"+reason+"```", ephemeral: true})
							user.send({content: "*You have been muted by `"+interaction.user.username+"` for "+ms(ms(length))+" from Plot Block [LIFESTEAL]!*\nThe reason given is: \n```"+reason+"```\nPlease refrain from breaking the rules once more. If you feel you are not familiar with the rules, please re-read the rules."}) .then((msg) => {
								setTimeout(() => {
									if (member.roles.cache.some(role => role.id == "1084533678849392731") && !member.roles.cache.some(role => role.id = "1084582068316549252")) {
										member.roles.remove(role)
										member.roles.add(talkingrole)
										msg.reply({content: "*This mute has expired.*"})
									}
								}, timeout);
							})
							
						} 
						if (!reason) {
							interaction.reply({content: "User has been muted for "+ms(ms(length))+". No reason given.", ephemeral: true})
							user.send({content: "*You have been muted by `"+interaction.user.username+"` for "+ms(ms(length))+" from Plot Block [LIFESTEAL]!*\nThere is no reason given for such an outlandish action.\nPlease refrain from breaking the rules once more. If you feel you are not familiar with the rules, please re-read the rules."}) .then((msg) => {
								setTimeout(() => {
									if (member.roles.cache.some(role => role.id == "1084533678849392731") && !member.roles.cache.some(role => role.id = "1084582068316549252")) {
										member.roles.remove(role)
										member.roles.add(talkingrole)
										msg.reply({content: "*This mute has expired.*"})
									}
								}, timeout);
							})
						} 
					} else {
						interaction.reply({content: "User may already be muted! Use", ephemeral: true})
					}
				} else {
					if (!member.roles.cache.some(role => role.id == "1084533678849392731") && member.roles.cache.some(role => role.id == "1084582068316549252")) {
						//not muted, mute
						member.roles.remove(talkingrole)
						member.roles.add(role)
						if (reason) {
							interaction.reply({content: "User has been muted. Reason has been given:\n```"+reason+"```", ephemeral: true})
							user.send({content: "*You have been muted by `"+interaction.user.username+"` from Plot Block [LIFESTEAL]!*\nThe reason given is: \n```"+reason+"```\nPlease refrain from breaking the rules once more. If you feel you are not familiar with the rules, please re-read the rules."}) .then((msg) => {
							})
							
						} 
						if (!reason) {
							interaction.reply({content: "User has been muted. No reason given.", ephemeral: true})
							user.send({content: "*You have been muted by `"+interaction.user.username+"` from Plot Block [LIFESTEAL]!*\nThere is no reason given for such an outlandish action.\nPlease refrain from breaking the rules once more. If you feel you are not familiar with the rules, please re-read the rules."}) .then((msg) => {
							})
						} 
					} else {
						interaction.reply({content: "User may already be muted!", ephemeral: true})
					}
				}
				
				
			})
		})
		const userID = user.id
		const plrSchema = require("../schema.js")
		const id = (new Date()).getTime()
		if (!reason) reason = "There is no reason."
		if (!length) length = "Permanent"
		if (length) length = ms(ms(length))
		try {
			const result = await plrSchema.findOneAndUpdate({
				userID
			}, {
				userID,
				$addToSet: {
					mutes: new mute(
						reason,
						length,
						id,
						"UTC+00 s/mi/h/d/mo/y: "+(new Date()).getUTCSeconds()+":"+(new Date()).getUTCMinutes()+":"+(new Date()).getUTCHours()+":"+(new Date()).getDay()+":"+(new Date()).getUTCMonth()+":"+(new Date()).getUTCFullYear()
					)
				}
			}, {
				upsert: true,
				new: true
			})
			console.log(result)
		} catch(e) {
			console.log(e)
		}
	},
};