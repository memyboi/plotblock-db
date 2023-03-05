const { error } = require('console');
const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, PermissionsBitField, EmbedBuilder } = require('discord.js');
const namechangedrecently = new Set();
const commandDelay = 10 //minutes 
const invitesentrecently = new Set();
const inviteDelay = 5 //minutes 

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chat')
		.setDescription('This command can do many things to your personal chat.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('config')
				.setDescription('Change things about the chat.')
				.addStringOption(option =>
					option
						.setName('setting')
						.setDescription('The setting to change.')
						.setRequired(true)
						.addChoices(
							{ name: 'name', value: 'setname' },
						)),
			)
		.addSubcommand(subcommand =>
			subcommand
				.setName('invite')
				.setDescription('Invite a user to your personal chat.')
				.addUserOption(option =>
					option
						.setName('user')
						.setDescription('The user to invite.')
						.setRequired(true)
						)
						
			)
		.addSubcommand(subcommand =>
			subcommand
				.setName('kick')
				.setDescription('Kick a user from your personal chat.')
				.addUserOption(option =>
					option
						.setName('user')
						.setDescription('The user to kick.')
						.setRequired(true)
						)
						
			)
		.addSubcommand(subcommand =>
			subcommand
				.setName('leave')
				.setDescription('Leave a personal chat.')
						
			)
		.addSubcommand(subcommand =>
			subcommand
				.setName('info')
				.setDescription('Give information about the personal chat.')
						
			),
	async execute(interaction, client) {
		if (interaction.options.getSubcommand() == "config") {
			const setting = interaction.options.getString('setting');
			if (setting == "setname") {
				if (namechangedrecently.has(interaction.user.id)) {
					return interaction.reply({content:"Please wait " + commandDelay + " minutes until you can change the name of your personal chat. This is because of rate limits.", ephemeral: true});
				} else {
					try {
						var userid = interaction.user.id
						var channelid = interaction.channel.id
						const xpSchema = require('../schema.js')
						const findRes = await xpSchema.find({ userID: userid })
						let pchat = findRes[0].pchat
						console.log("plr pchat id: "+pchat)
						if (channelid == pchat) {
							const modal = new ModalBuilder()
								.setCustomId('setchannelname')
								.setTitle('Set personal chat name here...');

							const txt = new TextInputBuilder()
								.setCustomId('newchannelname')
								.setLabel("Personal chat name")
								.setStyle(TextInputStyle.Short)
								.setMaxLength(20)
								.setRequired(true);
						
							const row = new ActionRowBuilder().addComponents(txt);
						
							modal.addComponents(row);
						
							await interaction.showModal(modal);
							if (interaction.guild != null) {
								// Adds the user to the set so that they can't talk for an hour
								namechangedrecently.add(interaction.user.id);
								setTimeout(() => {
								// Removes the user from the set after a minute
								namechangedrecently.delete(interaction.user.id);
								}, commandDelay * 60000)
							}
						} else {
							interaction.reply({ content: "This channel is not your personal chat! >:(", ephemeral: true});
						}
					} catch(e) {
						interaction.reply({ content: "There was an error confirming that you own this channel.", ephemeral: true})
						return console.log(e);
					}
				}
			}
		} else if (interaction.options.getSubcommand() == "invite") {
			const xpSchema = require('../schema.js')
			var user = interaction.options.getUser('user')
			const findRes = await xpSchema.find({ userID: interaction.user.id })
			if (user == interaction.user) return interaction.reply({content: "You are not able to invite yourself to your own chat >:(", ephemeral: true})
			if (user == client.user) return interaction.reply({content: "You are not able to invite me to your chat >:(", ephemeral: true})
			permissionsofuser = interaction.channel.permissionsFor(user)
			if (permissionsofuser && permissionsofuser.has(PermissionsBitField.Flags.ViewChannel, true)) return interaction.reply({content: "This person is in the chat already >:(", ephemeral: true})
			try {
				let blocked = findRes[0].blocked
				let pchat = findRes[0].pchat
				var alrBlocked = false
				if (interaction.channel.id != pchat) return interaction.reply({content: "You are unable to invite users to this chat!", ephemeral: true})

				try {
					blocked.forEach(element => {
						if (element == user.id) {
							alrBlocked = true
						}
					});
				} catch(e) {
					console.log(e);
					console.log("blocked list is undefined.")
				}
				
				if (alrBlocked) {
					interaction.reply({content: "The user "+user.username+" is blocked, so you cannot invite them to personal chats.", ephemeral: true})
				} else {
					const findRes = await xpSchema.find({ userID: user.id })
					try {
						let blocked2 = findRes[0].blocked
						var alrBlocked2 = false

						try {
							blocked2.forEach(element => {
								if (element == interaction.user.id) {
									alrBlocked2 = true
								}
							});
						} catch(e) {
							console.log("blocked list is undefined.")
							console.log(e);
						}

						if (alrBlocked2) {
							interaction.reply({content: "The user "+user.username+" has blocked you, so you cannot invite them to personal chats.", ephemeral: true})
						} else {
							interaction.guild.members.fetch(""+user.id)
								.then(member => {
									const acc = new ButtonBuilder()
										.setCustomId('acceptinv')
										.setLabel("Yes - Accept")
										.setStyle(ButtonStyle.Success)

									const dec = new ButtonBuilder()
										.setCustomId('declineinv')
										.setLabel("No - Decline")
										.setStyle(ButtonStyle.Danger)

									const row = new ActionRowBuilder().addComponents(acc, dec)
									interaction.reply({content: "The user "+user.username+" has been invited.", ephemeral: true})
									member.send(
									{
										content: "||[ "+interaction.channel.id+" ]||\n**You have been invited to `"+interaction.channel.name+"` by `"+interaction.user.username+"`!**\nPress **Yes to accept** the invite, and **No to decline**!\n_(Invites expire after 1 minute.)_", 
										components: [row]
									}) .then((msg) => {
										setTimeout(() => {
											msg.edit({content: "**This invite has expired, ask "+interaction.user.username+" for a new one!**", components: []})
										}, 1 * 60000)
									}) .catch((err) => {
										console.log(err)
									})

								})
								.catch(error => {
									interaction.reply({content: "There was an error while sending an invite.", ephemeral: true})
									console.log(error)
								});
							
						}
					} catch(e) {
						console.log(e);
						interaction.reply({content: "There was an error while sending an invite.", ephemeral: true})
					}
				}
			} catch(e) {
				console.log(e);
				interaction.reply({content: "There was an error while sending an invite.", ephemeral: true})
			}
		} else if (interaction.options.getSubcommand() == "kick") {
			const xpSchema = require('../schema.js')
			var user = interaction.options.getUser('user')
			const findRes = await xpSchema.find({ userID: interaction.user.id })
			if (user == interaction.user) return interaction.reply({content: "You are not able to kick yourself from your own chat >:(", ephemeral: true})
			if (user == client.user) return interaction.reply({content: "You are not able to kick me from your chat >:(", ephemeral: true})
			permissionsofuser = interaction.channel.permissionsFor(user)
			if (permissionsofuser && permissionsofuser.has(PermissionsBitField.Flags.ViewChannel, false)) {
				try {
					let pchat = findRes[0].pchat
					if (interaction.channel.id != pchat) return interaction.reply({content: "You are unable to kick users from this chat!", ephemeral: true})
					interaction.channel.permissionOverwrites.delete(user)
					interaction.reply({content: "This person has been kicked.", ephemeral: true})
					interaction.channel.send({content: "`"+user.username+"` has been kicked from this chat."})
				} catch(e) {
					console.log(e);
					interaction.reply({content: "There was an error while kicking this user.", ephemeral: true})
				}
				
			} else {
				interaction.reply({content: "This person is not in this chat >:(", ephemeral: true})
			}
		} else if (interaction.options.getSubcommand() == "leave") {
			const xpSchema = require('../schema.js')
			const findRes = await xpSchema.find({ userID: interaction.user.id })
			permissionsofuser = interaction.channel.permissionsFor(interaction.user)
			if (permissionsofuser && permissionsofuser.has(PermissionsBitField.Flags.ViewChannel, false) && interaction.channel.parentId == "1034576867715457184") {
				try {
					let pchat = findRes[0].pchat
					if (interaction.channel.id == pchat) return interaction.reply({content: "You are unable to leave your own chat!", ephemeral: true})
					interaction.channel.permissionOverwrites.delete(interaction.user)
					interaction.channel.send({content: "`"+interaction.user.username+"` has left this chat."})
				} catch(e) {
					console.log(e);
					interaction.reply({content: "There was an error while leaving this chat.", ephemeral: true})
				}
				
			} else {
				interaction.reply({content: "This is not a personal chat! >:(", ephemeral: true})
			}
		} else if (interaction.options.getSubcommand() == "info") {
			if (interaction.channel.parentId == "1034576867715457184") {
				var owner = "Unknown"
				var membersamnt = 0
				var allGuildMembers = 0
				interaction.guild.members.fetch() .then(async members => {
					members.forEach(async member => {
						if (member.user != client.user) {
							try {
								allGuildMembers = allGuildMembers + 1
								permissionsofuser = interaction.channel.permissionsFor(member.user)
								if (permissionsofuser && permissionsofuser.has(PermissionsBitField.Flags.ViewChannel, false)) {
									membersamnt = membersamnt + 1
								}
								
								try {
									const xpSchema = require('../schema.js')
									const findRes = await xpSchema.find({ userID: member.user.id })
									let pchat = findRes[0].pchat
									console.log(pchat+" => "+interaction.channel.id)
									if (interaction.channel.id == pchat) {
										console.log("owner detected! "+member.user.tag)
										if (owner == "Unknown") owner = ""+member.user.tag
										console.log(owner)
									}
								} catch(e) {
									console.log(e);
								}
							} catch(e) {
								console.log(e);
							}
						}
					})
				}) .then(async () => {
					try {
						var done = false
						for (let i = 0; i < 100; i++) {
							setTimeout(() => {
								if (owner != "Unknown") {
									done = true
								}
								if (i == 99) {
									done = true
								}
							}, 100)
							if (done) {
								break;
							}
						}
						var sent = false
						var alldone = false
						var lastchecksdone = false
						var completelydoneendfunc = false
						const isdonepromise = new Promise((resolve, reject) => {
							for (let i = 0; i < 100; i++) {
								try {
									setTimeout(() => {
										if (done && sent == false && alldone == false) {
											const infoEmbed = new EmbedBuilder()
												.setAuthor({ name: interaction.user.username })
												.addFields(
													{name: "Owner", value: owner, inline: false},
													{name: "Members", value: membersamnt+"/"+allGuildMembers, inline: false},
												)
												.setColor("#ff0000")
											sent = true
											alldone = true
											lastchecksdone = true
											completelydoneendfunc = true
											interaction.reply({embeds: [infoEmbed], ephemeral: true}) 
										}
										if (i == 99) {
											alldone = true
										}
										
									}, 100)
								} catch(e) {
									reject(e)
								}
								
								if (completelydoneendfunc) {
									resolve()
									break;
								}
							}
						});
						isdonepromise.catch((e) => {
							console.log(e)
							interaction.channel.send({content: "Getting info of channel failed.", ephemeral: true})
						})
					} catch(e) {
						console.log(e)
					}
				})
			} else {
				interaction.reply({content: "This is not a personal chat! >:(", ephemeral: true})
			}
		}
	} 
};