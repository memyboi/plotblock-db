const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { off } = require('process');


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
                .addStringOption(option =>
                    option
                        .setName("offence")
                        .setDescription("The type of offence to filter for.")
                        .setRequired(true)
                        .setChoices(
                            {name: "All (unstable)", value: "all"},
                            {name: "Warns", value: "warns"},
                            {name: "Mutes", value: "mutes"},
                            {name: "Kicks", value: "kicks"},
                            {name: "Bans", value: "bans"},
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Remove an offence of this user.")
                .addUserOption(option =>
                    option
                        .setName("target")
                        .setDescription("The user if which you want to remove the offence of.")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("offence")
                        .setDescription("The id of the offence to remove.")
                        .setRequired(true)
                )
        )
		,
	async execute(interaction, client) {
        const target = interaction.options.getUser("target")
        const offence = interaction.options.getString("offence")
        const plrSchema = require("../schema.js")
        const cmd = interaction.options.getSubcommand()
        client.guilds.fetch(""+process.env.guildid) .then((guild) => {
            guild.members.fetch(""+interaction.user.id) .then(async (member) => {
                if (member.roles.cache.some(role => role.id == "1022631935614406730")) {
                    guild.members.fetch(""+target.id) .then(async (tMember) => {
                        if (cmd == "view") {
                            const findRes = await plrSchema.find({ userID: target.id })
                            try {
                                let warns = "No data"
                                let mutes = "No data"
                                let kicks = "No data"
                                let bans = "No data"
                                try {if (findRes[0].warns) {
                                    warns = findRes[0].warns
                                    .map((warn) => "\n> **Warn ID - "+warn.id+"**\n> **Reason:** "+warn.reason+"\n> **Time:** "+warn.timestamp+"\n> ");}} catch(e) {console.log(e)}
                                    try {if (findRes[0].mutes) {
                                    mutes = findRes[0].mutes
                                    .map((mute) => "\n> **Mute ID - "+mute.id+"**\n> **Reason:** "+mute.reason+"\n> **Time:** "+mute.timestamp+"\n> ");}} catch(e) {console.log(e)}
                                try {if (findRes[0].kicks) {
                                    kicks = findRes[0].kicks
                                    .map((kick) => "\n> **Kick ID - "+kick.id+"**\n> **Reason:** "+kick.reason+"\n> **Time:** "+kick.timestamp+"\n> ");}} catch(e) {console.log(e)}
                                try {if (findRes[0].bans) {
                                    bans = findRes[0].bans
                                    .map((ban) => "\n> **Ban ID - "+ban.id+"**\n> **Reason:** "+ban.reason+"\n> **Time:** "+ban.timestamp+"\n> ");}} catch(e) {console.log(e)}

                                let infoEmbed = {}
                                if (offence == "all") {
                                    infoEmbed = new EmbedBuilder()
                                    .setAuthor({ name: target.username, iconURL: tMember.displayAvatarURL()})
                                    .setTitle(target.username+"'s offences:")
                                    .setDescription("> Warns => "+warns+"\n> Mutes => "+mutes+"\n> Kicks => "+kicks+"\n> Bans => "+bans)
                                } else if (offence == "warns") {
                                    infoEmbed = new EmbedBuilder()
                                    .setAuthor({ name: target.username, iconURL: tMember.displayAvatarURL()})
                                    .setTitle(target.username+"'s warns:")
                                    .setDescription("> Warns => "+warns)
                                } else if (offence == "mutes") {
                                    infoEmbed = new EmbedBuilder()
                                    .setAuthor({ name: target.username, iconURL: tMember.displayAvatarURL()})
                                    .setTitle(target.username+"'s mutes:")
                                    .setDescription("> Mutes => "+mutes)
                                } else if (offence == "kicks") {
                                    infoEmbed = new EmbedBuilder()
                                    .setAuthor({ name: target.username, iconURL: tMember.displayAvatarURL()})
                                    .setTitle(target.username+"'s kicks:")
                                    .setDescription("> Kicks => "+kicks)
                                } else if (offence == "bans") {
                                    infoEmbed = new EmbedBuilder()
                                    .setAuthor({ name: target.username, iconURL: tMember.displayAvatarURL()})
                                    .setTitle(target.username+"'s bans:")
                                    .setDescription("> Bans => "+bans)
                                }
                                interaction.reply({embeds: [infoEmbed], ephemeral: true})
                            } catch(e) {
                                console.log(e)
                                interaction.reply({content: "This user may have no offence data!", ephemeral: true})
                            }
                        } else if (cmd == "remove") {
                            const findRes = plrSchema.find({ userID: target.id })
                            try {
                                const requests = await Request.find({
                                    itemsList: { $elemMatch: { item: offence }}},);
                                console.log(requests)
                            } catch(e) {
                                console.log(e)
                                interaction.reply({content: "This user may have no offence data!", ephemeral: true})
                            }
                        }
                    })
                     
                } else {
                    interaction.reply({content: "You must verify in order to run this command!", ephemeral: true})
                }
            })
        })
	},
};