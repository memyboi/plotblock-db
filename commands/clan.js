const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

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

            if (result) {
                var t1 = result[(page*10) - 9].teamName; if (!t1) {t1 = ""}
                var t2 = result[(page*10) - 8].teamName; if (!t2) {t2 = ""}
                var t3 = result[(page*10) - 7].teamName; if (!t3) {t3 = ""}
                var t4 = result[(page*10) - 6].teamName; if (!t4) {t4 = ""}
                var t5 = result[(page*10) - 5].teamName; if (!t5) {t5 = ""}
                var t6 = result[(page*10) - 4].teamName; if (!t6) {t6 = ""}
                var t7 = result[(page*10) - 3].teamName; if (!t7) {t7 = ""}
                var t8 = result[(page*10) - 2].teamName; if (!t8) {t8 = ""}
                var t9 = result[(page*10) - 1].teamName; if (!t9) {t9 = ""}
                var t10 = result[(page*10)].teamName; if (!t10) {t10 = ""}
                var embed = new EmbedBuilder()
                    .setTitle("All clans (Page "+page+")")
                    .setDescription("Page "+page+": "+(page*10)-9+"-"+page*10)
                    .addFields(
                        {name: (page*10) - 9+"> "+t1, value: ""},
                        {name: (page*10) - 8+"> "+t2, value: ""},
                        {name: (page*10) - 7+"> "+t3, value: ""},
                        {name: (page*10) - 6+"> "+t4, value: ""},
                        {name: (page*10) - 5+"> "+t5, value: ""},
                        {name: (page*10) - 4+"> "+t6, value: ""},
                        {name: (page*10) - 3+"> "+t7, value: ""},
                        {name: (page*10) - 2+"> "+t8, value: ""},
                        {name: (page*10) - 1+"> "+t9, value: ""},
                        {name: (page*10)+"> "+t10, value: ""},
                    )
                interaction.reply({embeds: [embed], ephemeral: true})
            } else {
                interaction.reply({content: "There is no clan data!", ephemeral: true})
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