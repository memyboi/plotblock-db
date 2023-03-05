const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const blockuserid = async (blockuserid, userID, xpSchema) => {
	try {
		const result = await xpSchema.findOneAndUpdate({
		userID,
		}, {
		userID,
		$addToSet: { 
			blocked: [""+blockuserid] 
		},
		}, {
		upsert: true,
		new: true
		})
	} catch(e) {
		console.log(e)
	}
}

const unblockuserid = async (blockeduserid, userID, xpSchema) => {
	try {
		const result = await xpSchema.findOneAndUpdate({
		userID,
		}, {
		userID,
		$pull: { 
			blocked: [""+blockeduserid] 
		},
		}, {
		upsert: true,
		new: true
		})
	} catch(e) {
		console.log(e)
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('block')
		.setDescription('Block a user from battling, trading or inviting you to personal chats.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('list')
				.setDescription('List all blocked users.')
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Add a person to your list of blocked people.')
				.addUserOption(option =>
					option
						.setName('user')
						.setDescription('The user to block')
						.setRequired(true)
						)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Remove a person to your list of blocked people.')
				.addUserOption(option =>
					option
						.setName('user')
						.setDescription('The user to unblock')
						.setRequired(true)
						)
		),
	async execute(interaction, client) {
		if (interaction.options.getSubcommand() == "add") {
			try {
				const xpSchema = require('../schema.js')
				var user = interaction.options.getUser('user')
				const findRes = await xpSchema.find({ userID: interaction.user.id })
				try {
					let blocked = findRes[0].blocked
					var alrBlocked = false
					blocked.forEach(element => {
						if (element == user.id) {
							alrBlocked = true
						}
					});
					if (alrBlocked) {
						interaction.reply({content: user.username+" is already blocked.", ephemeral: true})
					} else {
						blockuserid(user.id, interaction.user.id, xpSchema)
						interaction.reply({content: user.username+" has now been blocked.", ephemeral: true})
					}
				} catch(e) {
					console.log(e);
				 	blockuserid(user.id, interaction.user.id, xpSchema)
					interaction.reply({content: user.username+" has now been blocked.", ephemeral: true})
				}
				
			} catch(e) {
				console.log(e)
				interaction.reply({content: "There was an issue while blocking this user.", ephemeral: true})
			}
		} else if (interaction.options.getSubcommand() == "remove") {
			try {
				const xpSchema = require('../schema.js')
				var user = interaction.options.getUser('user')
				const findRes = await xpSchema.find({ userID: interaction.user.id })
				try {
					let blocked = findRes[0].blocked
					var alrBlocked = false
					blocked.forEach(element => {
						if (element == user.id) {
							alrBlocked = true
						}
					});
					if (alrBlocked) {
						unblockuserid(user.id, interaction.user.id, xpSchema)
						interaction.reply({content: user.username+" has now been unblocked.", ephemeral: true})
					} else {
						interaction.reply({content: user.username+" is not blocked.", ephemeral: true})
					}
				} catch(e) {
				  console.log(e);
				  interaction.reply({content: "Your blocked users data is unnaccessable, try blocking someone first!", ephemeral: true})
				}
				
			} catch(e) {
				console.log(e)
				interaction.reply({content: "There was an issue while unblocking this user.", ephemeral: true})
			}
		} else if (interaction.options.getSubcommand() == "list") {
			try {
				const xpSchema = require('../schema.js')
				var user = interaction.options.getUser('user')
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
				
			} catch(e) {
				console.log(e)
				interaction.reply({content: "There was an issue while unblocking this user.", ephemeral: true})
			}
		}
	},
};