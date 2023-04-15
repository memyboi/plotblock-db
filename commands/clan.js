const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits, ModalBuilder } = require('discord.js');
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
                        .setDescription("The clan to get the info of. Please type in the 4 digit team code.")
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
        client.guilds.fetch(""+process.env.guildid) .then((guild) => {
            guild.members.fetch(""+interaction.user.id) .then(async (member) => {
                if (member.roles.cache.some(role => role.id == "1022631935614406730")) {
                    var cmdg = interaction.options.getSubcommandGroup()
                    var cmd = interaction.options.getSubcommand()
                    const teamschema = require("../schemateam.js")
                    const plrschema = require("../schema.js")
                    //temp:
                    if (interaction.user.username != "DeadFry42" && interaction.user.username != "deadfry-alt") return interaction.reply({content: "This command is WIP, and so you cannot use it yet. DeadFry42 & deadfry-alt can use it for testing purposes, however.", ephemeral: true})

                    if (cmd == "list") {
                        const result = await teamschema.find({ public: true })
                        var page = 1
                        //10 results per page

                        console.log(result)
                        if (result) {
                            var nothinInnit = false
                            var t1 = ""; var t2 = ""; var t3 = ""; var t4 = ""; var t5 = ""; var t6 = ""; var t7 = ""; var t8 = ""; var t9 = ""; var t10 = "";
                            var d1 = ""; var d2 = ""; var d3 = ""; var d4 = ""; var d5 = ""; var d6 = ""; var d7 = ""; var d8 = ""; var d9 = ""; var d10 = "";
                            var c1 = ""; var c2 = ""; var c3 = ""; var c4 = ""; var c5 = ""; var c6 = ""; var c7 = ""; var c8 = ""; var c9 = ""; var c10 = "";
                            try { var daresult = result[(page*10) - 10]; var a = daresult.teamName; var b = daresult.teamDesc; var c = daresult.teamShort; if (!a) {t1 = ""} else {t1 = a}; if (!b) {d1 = " "} else {console.log(b); d1 = b}; if (!c) {c1 = " "} else {c1 = c}; } catch(e) {console.log(e)}
                            try { var daresult = result[(page*10) - 9]; var a = daresult.teamName; var b = daresult.teamDesc; var c = daresult.teamShort; if (!a) {t2 = ""} else {t2 = a}; if (!b) {d2 = " "} else {console.log(b); d2 = b}; if (!c) {c2 = " "} else {c2 = c}; }  catch(e) {console.log(e)}
                            try { var daresult = result[(page*10) - 8]; var a = daresult.teamName; var b = daresult.teamDesc; var c = daresult.teamShort; if (!a) {t3 = ""} else {t3 = a}; if (!b) {d3 = " "} else {console.log(b); d3 = b}; if (!c) {c3 = " "} else {c3 = c}; }  catch(e) {console.log(e)}
                            try { var daresult = result[(page*10) - 7]; var a = daresult.teamName; var b = daresult.teamDesc; var c = daresult.teamShort; if (!a) {t4 = ""} else {t4 = a}; if (!b) {d4 = " "} else {console.log(b); d4 = b}; if (!c) {c4 = " "} else {c4 = c}; }  catch(e) {console.log(e)}
                            try { var daresult = result[(page*10) - 6]; var a = daresult.teamName; var b = daresult.teamDesc; var c = daresult.teamShort; if (!a) {t5 = ""} else {t5 = a}; if (!b) {d5 = " "} else {console.log(b); d5 = b}; if (!c) {c5 = " "} else {c5 = c}; }  catch(e) {console.log(e)}
                            try { var daresult = result[(page*10) - 5]; var a = daresult.teamName; var b = daresult.teamDesc; var c = daresult.teamShort; if (!a) {t6 = ""} else {t6 = a}; if (!b) {d6 = " "} else {console.log(b); d6 = b}; if (!c) {c6 = " "} else {c6 = c}; }  catch(e) {console.log(e)}
                            try { var daresult = result[(page*10) - 4]; var a = daresult.teamName; var b = daresult.teamDesc; var c = daresult.teamShort; if (!a) {t7 = ""} else {t7 = a}; if (!b) {d7 = " "} else {console.log(b); d7 = b}; if (!c) {c7 = " "} else {c7 = c}; }  catch(e) {console.log(e)}
                            try { var daresult = result[(page*10) - 3]; var a = daresult.teamName; var b = daresult.teamDesc; var c = daresult.teamShort; if (!a) {t8 = ""} else {t8 = a}; if (!b) {d8 = " "} else {console.log(b); d8 = b}; if (!c) {c8 = " "} else {c8 = c}; }  catch(e) {console.log(e)}
                            try { var daresult = result[(page*10) - 2]; var a = daresult.teamName; var b = daresult.teamDesc; var c = daresult.teamShort; if (!a) {t9 = ""} else {t9 = a}; if (!b) {d9 = " "} else {console.log(b); d9 = b}; if (!c) {c9 = " "} else {c9 = c}; }  catch(e) {console.log(e)}
                            try { var daresult = result[(page*10) - 1]; var a = daresult.teamName; var b = daresult.teamDesc; var c = daresult.teamShort; if (!a) {t10 = ""} else {t10 = a}; if (!b) {d10 = " "} else {console.log(b); d10 = b}; if (!c) {c10 = " "} else {c10 = c}; } catch(e) {console.log(e)}
                            const truncateText = function(txt, maxlength) {
                                if (!txt) return " "
                                if (txt.length > maxlength) {
                                    return txt.substring(0, maxlength - 3)+"..."
                                } else {
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
                                    if (result[(page*10)-offset].teamName) {return true} else {return false}
                                } catch(e) {
                                    return false
                                }
                            }
                            const code = function(code) {
                                if (code) {return "\nCode: "+code} else {return ""}
                            }
                            var embed = new EmbedBuilder()
                                .setTitle("All clans (Page "+page+")")
                                .setDescription("Page "+page+": "+((page*10)-9)+"-"+(page*10))
                                .addFields(
                                    {name: getpropertext(10, t1), value: truncateText(d1, 75)+code(c1)},
                                    {name: getpropertext(9, t2), value: truncateText(d2, 75)+code(c2)},
                                    {name: getpropertext(8, t3), value: truncateText(d3, 75)+code(c3)},
                                    {name: getpropertext(7, t4), value: truncateText(d4, 75)+code(c4)},
                                    {name: getpropertext(6, t5), value: truncateText(d5, 75)+code(c5)},
                                    {name: getpropertext(5, t6), value: truncateText(d6, 75)+code(c6)},
                                    {name: getpropertext(4, t7), value: truncateText(d7, 75)+code(c7)},
                                    {name: getpropertext(3, t8), value: truncateText(d8, 75)+code(c8)},
                                    {name: getpropertext(2, t9), value: truncateText(d9, 75)+code(c9)},
                                    {name: getpropertext(1, t10), value: truncateText(d10, 75)+code(c10)},
                                )
                            var leftdis = new ButtonBuilder()
                                .setCustomId("-goleftclanpage")
                                .setDisabled(true)
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("⬅️")
                            var rightdis = new ButtonBuilder()
                                .setCustomId("-gorightclanpage")
                                .setDisabled(true)
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("➡️")
                            var left = new ButtonBuilder()
                                .setCustomId((page-1)+"-goleftclanpage")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("⬅️")
                            var right = new ButtonBuilder()
                                .setCustomId((page+1)+"-gorightclanpage")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("➡️")
                            var leftchosen;
                            var rightchosen;
                            if (checkifpossible(11) == true) {leftchosen = left} else {leftchosen = leftdis}
                            if (checkifpossible(0) == true) {rightchosen = right} else {rightchosen = rightdis}
                            var row = new ActionRowBuilder()
                                .addComponents(leftchosen, rightchosen)
                            interaction.reply({embeds: [embed], components: [row], ephemeral: true})
                        } else {
                            interaction.reply({content: "There was an error getting the team data.", ephemeral: true})
                        }
                    } else if (cmd == "info") {
                        //string "clan"
                        //make an embed with clan info.
                        const clanCodeOld = interaction.options.getString("clan")
                        const result = await teamschema.find( { teamShort: clanCodeOld } )
                        try {
                            const clan = result[0] //clan info
                            const clanName = clan.teamName
                            const clanDesc = clan.teamDesc
                            const clanCode = clan.teamShort
                            const clanColour = clan.teamColour
                            const leaderID = clan.leaderID
                            const createdTime = clan.createTime
                            const internalIconId = parseInt(clan.teamIcon)
                            var icon = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Antonia_Sautter_Creations.png/120px-Antonia_Sautter_Creations.png"

                            switch (internalIconId) {
                                case undefined: icon = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Antonia_Sautter_Creations.png/120px-Antonia_Sautter_Creations.png"; break;
                                case 0: icon = "https://i.imgur.com/3I8zduR.png"; break;
                                case 1: icon = "https://i.imgur.com/FnQrZ1J.png"; break;
                                case 2: icon = "https://i.imgur.com/o74DInl.png"; break;
                                case 3: icon = "https://i.imgur.com/8rWy2Rd.png"; break;
                                case 4: icon = "https://i.imgur.com/CFk4VhY.png"; break;
                                case 5: icon = "https://i.imgur.com/xHqMarP.png"; break;
                                case 6: icon = "https://i.imgur.com/2WMYe9L.png"; break;
                                case 7: icon = "https://i.imgur.com/GgmEb1r.png"; break;
                            }

                            let leader = "None!"
                            let members = "No members!"
                            let allies = "No allies."
                            let truces = "No truces."
                            let wars = "No concurrent wars."
                            let blacklist = "No blacklisted members."
                            try {if (clan.users) {
                                members = clan.users
                            .map((member) => member.user.username+"#"+member.user.discriminator);}} catch(e) {}
                            try {if (clan.allies) {
                                allies = clan.allies
                            .map((allyTeam) => allyTeam.teamName+" - "+allyTeam.teamShort);}} catch(e) {}
                            try {if (clan.truces) {
                                truces = clan.truces
                            .map((truce) => truce.teamName+" - Expires: "+truce.ExpiryDate);}} catch(e) {}
                            try {if (clan.wars) {
                                wars = clan.wars
                            .map((war) => war.title+"");}} catch(e) {}
                            try {if (clan.blacklist) {
                                blacklist = clan.blacklist
                            .map((member) => member.user.username+"#"+member.user.discriminator);}} catch(e) {}

                            client.guilds.fetch(""+process.env.guildid) .then((guild) => {
                                guild.members.fetch(""+leaderID) .then((member) => {
                                    console.log("leaderfound")
                                    leader = member.user.username+"#"+member.user.discriminator

                                    var emb = new EmbedBuilder()
                                        .setTitle(clanName)
                                        .setDescription("**Full description => **"+clanDesc+"\n**Leader => **"+leader+"\n**Current members => **"+members+"\n**Allies => **"+allies+"\n**Truces => **"+truces+"\n**Wars => **"+wars+"\n**Blacklisted members => **"+blacklist)
                                        .setColor(clanColour)
                                        .setFooter({text: "---\nClan code - "+clanCode})
                                        .setThumbnail(icon)

                                    interaction.reply({embeds: [emb], ephemeral: true})
                                })
                            })
                            
                        } catch(e) {
                            interaction.reply({content: "The clan could not be found!", ephemeral: true})
                            console.log(e)
                        }
                    }else if (cmd == "create") {
                        //create a clan, needs 2 be lvl 5, costs 250 cash. popup w/ fancy menu thingy
                        const plrSchema = require("../schema.js")
                        const findRes = plrSchema.find({ userID: interaction.user.id })
                        try {
                            const cash = findRes[0].cash
                            const lvls = findRes[0].lvls
                            if (lvls < 2) {
                                interaction.reply({content: "You must be level 2 to create a clan!", ephemeral: true})
                            } else {
                                if (cash < 250) {
                                    interaction.reply({content: "You must have 250 cash to create a clan!", ephemeral: true})
                                } else {
                                    //create a popup
                                    const modal = new EmbedBuilder()
                                        .setTitle("Create a new clan.")
                                        .setDescription("This is the modal that will help you in setting up your clan.")
                                        .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()})

                                    await interaction.showModal(modal)
                                }
                            }
                            
                        } catch(e) {

                        }
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
                } else {
                    interaction.reply({content: "You must verify in order to run this command!", ephemeral: true})
                }
            })
        })
	},
};