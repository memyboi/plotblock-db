const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Lists the roles of a user')
		.addUserOption(option => 
			option
				.setName("user")
				.setDescription("The user to list the roles of.")
				.setRequired(true)
			)
		.setDMPermission(false)
		,
	async execute(interaction, client) {
		var user = interaction.options.getUser("user")
		client.guilds.fetch(""+process.env.guildid) .then((guild) => {
			guild.members.fetch(""+interaction.user.id) .then((runMember) => {
                if (runMember.roles.cache.some(role => role.id == "1022631935614406730")) {
                    guild.members.fetch(""+user.id) .then(async (member) => {
						const plrSchema = require("../schema.js")
						const findRes = await plrSchema.find({ userID: user.id })
						try {
							let teamname = "None!" //findres[0].teamID (processing needed)
							let cash = "None!" //findRes[0].cash
							let xp = "None!" //findRes[0].xp
							let lvls = "None!" //findRes[0].lvls
							let mcname = "None!" //findRes[0].minecraftUUID (processing needed, https://api.mojang.com/user/profile/)
		
							if (typeof findRes[0].cash != undefined) {cash = findRes[0].cash} 
							if (typeof findRes[0].xp != undefined) {xp = findRes[0].xp}
							if (typeof findRes[0].lvls != undefined) {lvls = findRes[0].lvls}
							if (typeof findRes[0].minecraftUUID != undefined) {
								fetch("https://api.mojang.com/user/profile/"+findRes[0].minecraftUUID)
									.then(data => data.json())
									.then(async (player) => {
										mcname = player.name
										const memberRoles = member.roles.cache
											.filter((roles) => roles.id !== interaction.guild.id)
											.map((role) => role.toString());
		
										const exampleEmbed = new EmbedBuilder()
											.setAuthor({ name: user.username, iconURL: member.displayAvatarURL()})
											.setDescription(`${user.username}'s information:\n> minecraft name => ${mcname}\n> team => ${teamname}\n> cash => `+"$"+`${cash}\n> xp => X:${xp}\n> lvls => L:${lvls}\n> roles => ${memberRoles}`)
											.setColor("#ff0000")
										
										interaction.reply({embeds: [exampleEmbed], ephemeral: true});
									})
							} 
						} catch(e) {
							console.log(e)
							interaction.reply({content: user.username+" does not have any user data!", ephemeral: true});
						}
					})
                } else {
                    interaction.reply({content: "You must verify in order to run this command!", ephemeral: true})
                }
            })
		})
	},
};