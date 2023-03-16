const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const { off } = require('process');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clan')
		.setDescription('Manage (your) clans')
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("List all currently registered clans")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("info")
                .setDescription("Give all the info about a specific clan.")
                .addStringOption(option => 
                    option
                        .setName("clan")
                        .setDescription("The clan to get the info of. Please type in their name.")
                        .setRequired(true)
                )
        )
		.addSubcommand(subcommand =>
            subcommand
                .setName("create")
                .setDescription("Create a clan (requirements: 250 cash, minimum lvl 5)")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("join")
                .setDescription("Join another persons clan (requirements: minimum lvl 3)")
                .addStringOption(option => 
                    option
                        .setName("clan")
                        .setDescription("The clan to join. Please type in their name.")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("leave")
                .setDescription("Leave a clan (cannot be yours)")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("kick")
                .setDescription("Kick a user out of your clan.")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("The person to kick out of the clan.")
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("disband")
                .setDescription("Disband your own clan.")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("war")
                .setDescription("Make your clan begin a war against another clan. Cannot start a war during a truce.")
                .addStringOption(option => 
                    option
                        .setName("clan")
                        .setDescription("The clan to start war against. Please type in their name.")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("ally")
                .setDescription("Make your clan become allies with another clan. Cannot ally during a war.")
                .addStringOption(option => 
                    option
                        .setName("clan")
                        .setDescription("The clan to ally with. Please type in their name.")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("unally")
                .setDescription("Make your clan break ties with another clan.")
                .addStringOption(option => 
                    option
                        .setName("clan")
                        .setDescription("The clan to break ties with. Please type in their name.")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("settings")
                .setDescription("Change the settings of your clan.")
                .addStringOption(option => 
                    option
                        .setName("setting")
                        .setDescription("The setting to change.")
                        .setRequired(true)
                )
                .addStringOption(option => 
                    option
                        .setName("value")
                        .setDescription("What to change the setting to.")
                        .setRequired(true)
                )
        )
        .addSubcommandGroup(subcommandgroup =>
            subcommandgroup
                .setName("blacklist")
                .setDescription("Disable someones ability to request to join your clan.")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("add")
                        .setDescription("Add anyone to your clans blacklist")
                        .addUserOption(option =>
                            option
                                .setName("user")
                                .setDescription("The user to blacklist from your clan.")
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("remove")
                        .setDescription("Remove anyone from your clans blacklist")
                        .addUserOption(option =>
                            option
                                .setName("user")
                                .setDescription("The user to unblacklist from your clan.")
                        )
                )
        )
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
		.setDMPermission(false)
		,
	async execute(interaction, client) {
        var cmdg = interaction.options.getSubcommandGroup()
		var cmd = interaction.options.getSubcommand()
        const teamschema = require("../schemateam.js")
        const plrschema = require("../schema.js")
        //temp:
        if (interaction.user.username != "DeadFry42" && interaction.user.username != "deadfry-alt") return interaction.reply({content: "This command is WIP, and so you cannot use it yet. DeadFry42 & deadfry-alt can use it for testing purposes, however.", ephemeral: true})

        if (cmd == "list") {
            const result = await teamschema.find()
            var page = 1
            //10 results per page

            console.log(result)
            if (result) {
                var nothinInnit = false
                var t1 = ""; var t2 = ""; var t3 = ""; var t4 = ""; var t5 = ""; var t6 = ""; var t7 = ""; var t8 = ""; var t9 = ""; var t10 = "";
                var d1 = ""; var d2 = ""; var d3 = ""; var d4 = ""; var d5 = ""; var d6 = ""; var d7 = ""; var d8 = ""; var d9 = ""; var d10 = "";
                try { var daresult = result[(page*10) - 10]; var a = daresult.teamName; var b = daresult.teamDesc; if (!a) {t1 = ""} else {t1 = a}; if (!b) {d1 = " "} else {console.log(b); d1 = b} } catch(e) {console.log(e)}
                try { var daresult = result[(page*10) - 9]; var a = daresult.teamName; var b = daresult.teamDesc; if (!a) {t2 = ""} else {t2 = a}; if (!b) {d2 = " "} else {console.log(b); d2 = b} }  catch(e) {console.log(e)}
                try { var daresult = result[(page*10) - 8]; var a = daresult.teamName; var b = daresult.teamDesc; if (!a) {t3 = ""} else {t3 = a}; if (!b) {d3 = " "} else {console.log(b); d3 = b} }  catch(e) {console.log(e)}
                try { var daresult = result[(page*10) - 7]; var a = daresult.teamName; var b = daresult.teamDesc; if (!a) {t4 = ""} else {t4 = a}; if (!b) {d4 = " "} else {console.log(b); d4 = b} }  catch(e) {console.log(e)}
                try { var daresult = result[(page*10) - 6]; var a = daresult.teamName; var b = daresult.teamDesc; if (!a) {t5 = ""} else {t5 = a}; if (!b) {d5 = " "} else {console.log(b); d5 = b} }  catch(e) {console.log(e)}
                try { var daresult = result[(page*10) - 5]; var a = daresult.teamName; var b = daresult.teamDesc; if (!a) {t6 = ""} else {t6 = a}; if (!b) {d6 = " "} else {console.log(b); d6 = b} }  catch(e) {console.log(e)}
                try { var daresult = result[(page*10) - 4]; var a = daresult.teamName; var b = daresult.teamDesc; if (!a) {t7 = ""} else {t7 = a}; if (!b) {d7 = " "} else {console.log(b); d7 = b} }  catch(e) {console.log(e)}
                try { var daresult = result[(page*10) - 3]; var a = daresult.teamName; var b = daresult.teamDesc; if (!a) {t8 = ""} else {t8 = a}; if (!b) {d8 = " "} else {console.log(b); d8 = b} }  catch(e) {console.log(e)}
                try { var daresult = result[(page*10) - 2]; var a = daresult.teamName; var b = daresult.teamDesc; if (!a) {t9 = ""} else {t9 = a}; if (!b) {d9 = " "} else {console.log(b); d9 = b} }  catch(e) {console.log(e)}
                try { var daresult = result[(page*10) - 1]; var a = daresult.teamName; var b = daresult.teamDesc; if (!a) {t10 = ""} else {t10 = a}; if (!b) {d10 = " "} else {console.log(b); d10 = b} } catch(e) {console.log(e)}
                const truncateText = function(txt, maxlength) {
                    if (!txt) return " "
                    console.log(txt)
                    console.log("txtle: ",txt.length)
                    console.log("mle: ", maxlength)
                    if (txt.length > maxlength) {
                        return txt.substring(0, maxlength - 3)+"..."
                    } else {
                        console.log("assdsad")
                        return txt
                    }
                }
                const getpropertext = function(offset, string) {
                    if (!nothinInnit) {
                        if (!string) { if (offset == 10 && t1 == "") {nothingInnit = true; return "There is no clan data."} else {return " "} }
                        var currentmax = (page*10)
                        var num = 1+currentmax - offset
                        return "> "+num+" - "+string
                    }
                }
                const checkifpossible = function(offset) {
                    try {
                        if (result[(page*10)-offset].teamName) {return false} else {return true}
                    } catch(e) {
                        return false
                    }
                }
                var embed = new EmbedBuilder()
                    .setTitle("All clans (Page "+page+")")
                    .setDescription("Page "+page+": "+((page*10)-9)+"-"+(page*10))
                    .addFields(
                        {name: getpropertext(10, t1), value: truncateText(d1, 75)},
                        {name: getpropertext(9, t2), value: truncateText(d2, 75)},
                        {name: getpropertext(8, t3), value: truncateText(d3, 75)},
                        {name: getpropertext(7, t4), value: truncateText(d4, 75)},
                        {name: getpropertext(6, t5), value: truncateText(d5, 75)},
                        {name: getpropertext(5, t6), value: truncateText(d6, 75)},
                        {name: getpropertext(4, t7), value: truncateText(d7, 75)},
                        {name: getpropertext(3, t8), value: truncateText(d8, 75)},
                        {name: getpropertext(2, t9), value: truncateText(d9, 75)},
                        {name: getpropertext(1, t10), value: truncateText(d10, 75)},
                    )
                var left = new ButtonBuilder()
                    .setCustomId("goleftclanpage-"+page)
                    .setDisabled(checkifpossible(11))
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel("⬅️")
                var right = new ButtonBuilder()
                    .setCustomId("gorightclanpage-"+page)
                    .setDisabled(checkifpossible(-1))
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel("➡️")
                interaction.reply({embeds: [embed], components: [left, right], ephemeral: true})
            } else {
                interaction.reply({content: "There was an error getting the team data.", ephemeral: true})
            }
        } else if (cmd == "info") {
            //string "clan"
            //make an embed with clan info.
        }else if (cmd == "create") {
            //create a clan, needs 2 be lvl 5, costs 250 cash. popup w/ fancy menu thingy
        } else if (cmd == "join") {
            //string "clan"
            //send a req to join a clan, needs 2 be lvl 3 to do so.
        } else if (cmd == "leave") {
            //leave a clan. cannot be urs. make a confirmation message before you leaved
        } else if (cmd == "kick") {
            //user "user"
            //kick a user out of ur clan. u have to own clan.
        } else if (cmd == "disband") {
            //remove clan. has to be urs. make a confirmation message before you disband. twice.
        } else if (cmd == "war") {
            //string "clan"
            //start war w/ another clan. u have to own a clan. make a confirmation message before you start war.
        } else if (cmd == "ally") {
            //string "clan"
            //ally w/ another clan. u have to own clan. make a confirmation message before you ally.
        } else if (cmd == "unally") {
            //string "clan"
            //break ties w/ another clan. u have to own clan. make a confirmation message before you unally.
        } else if (cmd == "settings") {
            //string "setting"
            //string "value"
            //change some settings abt the clan. u have to own clan
        } else if (cmdg == "blacklist") {
            if (cmd == "add") {
                //user "user"
                //add a user to the clans blacklist. u have to own.
            } else if (cmd == "remove") {
                //user "user"
                //remove a user from the clans blacklist. u have to own.
            }
        }
	},
};