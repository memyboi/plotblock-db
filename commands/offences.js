const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('offences')
		.setDescription('Gives you the offences that a user has done in the past.')
		.setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName("view")
                .setDescription("View the offences of this user.")
                .addUserOption(option =>
                    option
                        .setName("target")
                        .setDescription("The user of which you want to get the offences of.")
                        .setRequired(true)
                )
        )
		,
	async execute(interaction, client) {
        const target = interaction.options.getUser("target")
        const cmd = interaction.options.getSubcommand()
        client.guilds.fetch(""+process.env.guildid) .then((guild) => {
            guild.members.fetch(""+interaction.user.id) .then(async (member) => {
                if (member.roles.cache.some(role => role.id == "1022631935614406730")) {
                    if (cmd == "view") {
                        const plrSchema = require("../schema.js")
                        const findRes = await plrSchema.find({ userID: target.id })
                        try {
                            const warns = "No data"
                            const mutes = "No data"
                            const kicks = "No data"
                            const bans = "No data"
                            try {if (findRes[0].warns) {
                                warns = findRes[0].warns
                                .map((warn) => "**Warn ID - "+warn.id+"**/n"+warn.reason+"/n"+warn.timestamp);}} catch(e) {}
                            try {if (findRes[0].mutes) {
                                mutes = findRes[0].mutes
                                .map((mute) => "**Mute ID - "+mute.id+"**/n"+mute.reason+"/n"+mute.timestamp);}} catch(e) {}
                            try {if (findRes[0].kicks) {
                                kicks = findRes[0].kicks
                                .map((kick) => "**Kick ID - "+kick.id+"**/n"+kick.reason+"/n"+kick.timestamp);}} catch(e) {}
                            try {if (findRes[0].bans) {
                                bans = findRes[0].bans
                                .map((ban) => "**Warn ID - "+ban.id+"**/n"+ban.reason+"/n"+ban.timestamp);}} catch(e) {}
                            
                            const infoEmbed = new EmbedBuilder()
                                .setTitle(target.username+"'s offences:")
                                .addFields(
                                    {name: "Warns:", value: warns},
                                    {name: "Mutes:", value: mutes},
                                    {name: "Kicks:", value: kicks},
                                    {name: "Bans:", value: bans},
                                )
                        } catch(e) {
                            console.log(e)
                            interaction.reply({content: "This user may have no offence data!", ephemeral: true})
                        }
                    } 
                } else {
                    interaction.reply({content: "You must verify in order to run this command!", ephemeral: true})
                }
            })
        })
	},
};