const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get help on certain topics')
		.addSubcommandGroup(subcommandgroup =>
			subcommandgroup
				.setName("command")
				.setDescription("Gives help on a certain command.")
				.addSubcommand(subcommand =>
					subcommand
						.setName('chat')
						.setDescription('Gives help on the /chat command')
				)
				.addSubcommand(subcommand =>
					subcommand
						.setName('block')
						.setDescription('Gives help on the /block command')
				)
				.addSubcommand(subcommand =>
					subcommand
						.setName('unblock')
						.setDescription('Gives help on the /unblock command')
				)
			)
		.addSubcommandGroup(subcommandgroup =>
			subcommandgroup
				.setName("mechanics")
				.setDescription("Gives help on a certain mechanic.")
				.addSubcommand(subcommand =>
					subcommand
						.setName('chat')
						.setDescription('Gives help on the personal chat mechanic')
				)
				.addSubcommand(subcommand =>
					subcommand
						.setName('rare_pokemon')
						.setDescription('Gives help on the rare pokemon mechanic')
				)
				.addSubcommand(subcommand =>
					subcommand
						.setName('encounters')
						.setDescription('Gives help on the encounter mechanic')
				)
			),
	async execute(interaction, client) {
		if (interaction.options.getSubcommandGroup() == "command") {
			if (interaction.options.getSubcommand() == "chat") {
				txt = `Commands with [O] will mean you need to be an owner of the channel to be able to run the command
				Commands with [IC] will mean you need to run the command in the channel to be able to run the command.
				
				> [O] /chat invite {user} ¦ Invite a person to your chat. They need to accept before they join.
				> 
				> [IC] [O] /chat config {setting} ¦ This will bring up a prompt to change a certain setting (eg. name)
				> 
				> [IC] [O] /chat kick {user} ¦ This will kick a user from your chat.
				> 
				> [IC] /chat leave ¦ This will make you leave the chat you use the command in. You cannot leave your own chat.
				> 
				> [IC] /chat info ¦ This will display some stats about the chat you use the command in.
				`
				const embed = new EmbedBuilder()
					.setTitle("Help: /chat")
					.setDescription(txt)
				interaction.reply({embeds: [embed], ephemeral: true})
			} else if (interaction.options.getSubcommand() == "block") {
				txt = `> /block add {user} ¦ Blocks user
				> /block list ¦ Lists all blocked users.
				`
				const embed = new EmbedBuilder()
					.setTitle("Help: /block")
					.setDescription(txt)
				interaction.reply({embeds: [embed], ephemeral: true})
			} else if (interaction.options.getSubcommand() == "unblock") {
				txt = `> /block remove {user} ¦ Unblocks user
				`
				const embed = new EmbedBuilder()
					.setTitle("Help: /unblock")
					.setDescription(txt)
				interaction.reply({embeds: [embed], ephemeral: true})
			}
		} else if (interaction.options.getSubcommandGroup() == "mechanics") {
			if (interaction.options.getSubcommand() == "chat") {
				txt = `What are personal chats?
				
				Well, as you may know, the pokemon channels can get a little bit chaotic, however, you will be able to have your own channel, where you can invite your friends, customize it and whatever else you need!
				
				**Everyone has their own channel!**
				Your channel will start with no name, which you need to set yourself before you can talk in the channel, and then you will have access to all of the commands below:
				
				**Commands**
				run /help commands chat for these commands.
				`
				const embed = new EmbedBuilder()
					.setTitle("Help: personal chats")
					.setDescription(txt)
				interaction.reply({embeds: [embed], ephemeral: true})
			} else if (interaction.options.getSubcommand() == "rare_pokemon") {
				txt = `As you may know, there are shiny pokemon. Shiny pokemon are not in this discord server, but there are other rare pokemon.

				Yes. Here are all the rare pokemon.
				> **Glamorous Pokemon** ¦ These are shinier shiny pokemon, they have the same looks as a shiny pokemon, but atleast one of their stats are maxed out by default. This stat is random and may be good or bad for you. They have about the same encounter rate as a shiny pokemon.
				> 
				> **Inverse Pokemon** ¦ These pokemon are the same pokemon, but they are completely reversed. Their sprites are reversed in colour and their typings are reversed, however their moves are still the same.
				> 
				> **Grand Pokemon** ¦ These pokemon are larger and they do more damage. They also have slightly increased stats.
				
				There are no shinies, but they are replaced with glamorous pokemon.
				
				So, how rare are they?
				Well, If you thought finding a shiny pokemon was hard, try finding one of these.
				> **Glamorous pokemon have an encounter rate of 1/4,000**, which is close enough to the regular 1/4,096 of a shiny
				> 
				> **Inverse Pokemon have an encounter rate of 1/8,000**, which is basically the old shiny rate at 1/8,192.
				> 
				> **Grand Pokemon have an encounter rate of 1/20,000**, which is really rare.
				
				All of these pokemon (and legendaries) have a new encounter type, battle encounters!
				Run /help mechanics encounters for those encounters!
				`
				const embed = new EmbedBuilder()
					.setTitle("Help: rare pokemon")
					.setDescription(txt)
				interaction.reply({embeds: [embed], ephemeral: true})
			} else if (interaction.options.getSubcommand() == "encounters") {
				txt = `There are 2 types of encounters: regular and battle encounters.
				> Battle encounters are similar to actual pokemon encounters, you have to send out a pokemon and fight the pokemon in order to catch it.
				To enter a battle encounter, use /battle  and then you will begin to fight them in DMs. If you lose, the pokemon will flee back into the channel, where anyone but you can battle it.

				> Regular encounters are similar to let's go pokemon encounters, you cannot send out pokemon to fight and you need to catch it.
				To enter a regular encounter, use /catch {pokeballType} and then you will have a chance of catching it.

				*What pokemon have these regular encounters?*
				Almost if not all pokemon you will find in this game will have this encounter.
				This encounter happens on every pokemon excluding legendaries, mythicals and rare pokemon.

				*What pokemon have these battle encounters?*
				Not many pokemon have this encounter type. They only occur on legendaries, mythicals and rare pokemon.
				Run /help mechanics rare_pokemon for the new rare pokemon
				`
				const embed = new EmbedBuilder()
					.setTitle("Help: encounters")
					.setDescription(txt)
				interaction.reply({embeds: [embed], ephemeral: true})
			}
		}
	},
};