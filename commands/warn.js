const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

let warn = class {
    constructor(
        reason,
		id,
		timestamp
        ) {

        this.reason = reason
		this.timestamp = timestamp
		this.id = id
      }
}

const muteuser = function(time, user, client) {
	client.guilds.fetch(""+process.env.guildid) .then((guild) => {
		var role = guild.roles.cache.find(role => role.id == "1084533678849392731")
		var talkingrole = guild.roles.cache.find(role => role.id == "1084582068316549252")
		guild.members.fetch(""+user.id) .then((member) => {
			var role = guild.roles.cache.find(role => role.id == "1084533678849392731")
			var talkingrole = guild.roles.cache.find(role => role.id == "1084582068316549252")
			if (!member.roles.cache.some(role => role.id == "1084533678849392731") && member.roles.cache.some(role => role.id = "1084582068316549252")) {
				member.roles.remove(talkingrole)
				member.roles.add(role)
				setTimeout(() => {
					if (member.roles.cache.some(role => role.id == "1084533678849392731") && !member.roles.cache.some(role => role.id = "1084582068316549252")) {
						member.roles.remove(role)
						member.roles.add(talkingrole)
					}
				}, time);
			}
		})
	})
}
const kickuser = function(user, client) {
	client.guilds.fetch(""+process.env.guildid) .then((guild) => {
		guild.members.fetch(""+user.id) .then((member) => {
			user.send({content:"Because you have recieved too many warnings, you have been kicked."}) .then(() => {
				member.kick("Recieved too many warnings.")
			})
		})
	})
}

const banuser = function(user, client) {
	client.guilds.fetch(""+process.env.guildid) .then((guild) => {
		guild.members.fetch(""+user.id) .then((member) => {
			user.send({content:"Because you have recieved too many warnings, you have been banned."}) .then(() => {
				member.ban({reason: "Receieved too many warnings.", deleteMessageSeconds: 60 * 60 * 24 * 7 })
			})
		})
	})
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warn a user for a reason.')
		.addUserOption(option => 
			option
				.setName("user")
				.setDescription("The user to warn.")
				.setRequired(true)
			)
		.addStringOption(option => 
			option
				.setName("reason")
				.setDescription("The reason to warn this user.")
			)
		.setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
		.setDMPermission(false)
		,
	async execute(interaction, client) {
		var user = interaction.options.getUser("user")
		var reason = interaction.options.getString("reason")
		
		if (!reason) {
			user.send({content: "*You have been warned by `"+interaction.user.username+"` from Plot Block [LIFESTEAL]!*\nThere is no reason given for such an outlandish action.\nPlease refrain from breaking the rules once more. If you feel you are not familiar with the rules, please re-read the rules."})
			interaction.reply({content: "User has been warned. No reason given.", ephemeral: true})
		} else {
			user.send({content: "*You have been warned by `"+interaction.user.username+"` from Plot Block [LIFESTEAL]!*\nThe reason given is: \n```"+reason+"```\nPlease refrain from breaking the rules once more. If you feel you are not familiar with the rules, please re-read the rules."})
			interaction.reply({content: "User has been warned. Reason has been given:\n```"+reason+"```", ephemeral: true})
		}
		const userID = user.id
		const plrSchema = require("../schema.js")
		const id = (new Date()).getTime()
		if (!reason) reason = "There is no reason."
		try {
			const result = await plrSchema.findOneAndUpdate({
				userID
			}, {
				userID,
				$addToSet: {
					warns: new warn(
						reason,
						id,
						"UTC+00 s/mi/h/d/mo/y: "+(new Date()).getUTCSeconds()+":"+(new Date()).getUTCMinutes()+":"+(new Date()).getUTCHours()+":"+(new Date()).getDate()+":"+(new Date()).getUTCMonth()+":"+(new Date()).getUTCFullYear()
					)
				}
			}, {
				upsert: true,
				new: true
			})
			try {
				switch (result.warns.length) {
					case 0: break;
					case 1: break;
					case 2: muteuser(ms("10 minutes"), user, client); break;
					case 3: muteuser(ms("20 minutes"), user, client); break;
					case 4: muteuser(ms("30 minutes"), user, client); break;
					case 5: muteuser(ms("1 hour"), user, client); break;
					case 6: muteuser(ms("3 hours"), user, client); break;
					case 7: muteuser(ms("6 hours"), user, client); break;
					case 8: muteuser(ms("8 hours"), user, client); break;
					case 9: muteuser(ms("12 hours"), user, client); break;
					case 10: kickuser(user, client); break;
					case 11: muteuser(ms("24 hours"), user, client); break;
					case 12: muteuser(ms("36 hours"), user, client); break;
					case 13: muteuser(ms("48 hours"), user, client); break;
					case 14: muteuser(ms("72 hours"), user, client); break;
					case 14: muteuser(ms("72 hours"), user, client); break;
					case 15: kickuser(user, client); break;
					case 16: kickuser(user, client); break;
					case 17: kickuser(user, client); break;
					case 18: kickuser(user, client); break;
					case 19: kickuser(user, client); break;
					case 20: banuser(user, client); break;
				}
			} catch(e) {
				console.log(e)
			}
		} catch(e) {
			console.log(e)
		}
	},
};