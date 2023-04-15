const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('livemap')
		.setDescription('Gives you a link to the live map')
		.setDMPermission(false)
		,
	async execute(interaction, client) {
        client.guilds.fetch(""+process.env.guildid) .then((guild) => {
            guild.members.fetch(""+interaction.user.id) .then((member) => {
                const isVerifiedRole = guild.roles.cache.find(role => role.id == "1022631935614406730")
                if (!member.roles.cache.has(isVerifiedRole)) {
                    return interaction.reply({content: "You must verify in order to run this command!", ephemeral: true})
                }
            })
        })
		interaction.reply({content: "The livemap is available [here](http://plotblock.my.pebble.host:8127/#).", ephemeral: true})
	},
};