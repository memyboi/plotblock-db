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
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
		.setDMPermission(false)
		,
	async execute(interaction, client) {
		var cmd = interaction.options.getSubcommand()
        if (interaction.user.username != "DeadFry42" || interaction.user.username != "deadfry-alt") return interaction.reply({content: "This command is WIP, and so you cannot use it yet. DeadFry42 & deadfry-alt can use it for testing purposes, however.", ephemeral: true})
        if (cmd == "list") {
            //list all clans. top 10, multiple pages
        } else if (cmd == "info") {
            //make an embed with clan info.
        }else if (cmd == "create") {
            //create a clan, needs 2 be lvl 5, costs 250 cash
        } else if (cmd == "join") {
            //send a req to join a clan, needs 2 be lvl 3 to do so.
        } else if (cmd == "leave") {
            //leave a clan. cannot be urs
        } else if (cmd == "disband") {
            //remove clan. has to be urs. make a confirmation message before you disband. twice.
        } else if (cmd == "war") {
            //start war w/ another clan. u have to own a clan. make a confirmation message before you start war.
        } else if (cmd == "ally") {
            //ally w/ another clan. u have to own clan. make a confirmation message before you ally.
        } else if (cmd == "unally") {
            //break ties w/ another clan. u have to own clan. make a confirmation message before you unally.
        } else if (cmd == "settings") {
            //change some settings abt the clan. u have to own clan
        }
        
	},
};