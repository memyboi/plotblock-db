const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const pkmnData = require("../data/pkmndata.js")
const eggData = require("../data/eggdata.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pokedex')
		.setDescription('Get info on a pokemon via the pokedex.')
		.addNumberOption(option => 
			option
				.setName("pokemon_id")
				.setDescription("Get pokedex information on the pokemon of the id you put in.")
				.setMinValue(1)
				.setMaxValue(2)
		),
	async execute(interaction, client) {
		var id = interaction.options.getNumber('pokemon_id')
		var pkmn = pkmnData.Pokemon[id - 1]

		var newid = ""+(id)
		if (newid.length == 1 || id > 9) newid = "00"+newid
		if (newid.length == 2 || id > 99) newid = "0"+newid

		console.log(newid)

		function type2instring() {
			if (pkmn.types.primary != pkmn.types.secondary) {
				return "\n**2:** "+pkmn.types.secondary+"\n\n"
			} else {
				return "\n\n"
			}
		}

		function egggroup() {
			if (pkmn.egg.group1 != eggData.None) {
				if (pkmn.egg.group2 != eggData.None) {
					return "**1:** "+pkmn.egg.group1+"\n**2:** "+pkmn.egg.group2
				} else {
					return "**1:** "+pkmn.egg.group1
				}
			} else {
				return ""+pkmn.egg.group1
			}
		}

		const dexentry = new EmbedBuilder()
			.setTitle(pkmn.name)
			.setThumbnail("https://www.serebii.net/swordshield/pokemon/"+newid+".png")
			.addFields(
				{name: ""+pkmn.pokedex.pokemonsynopsys, value: ""+pkmn.pokedex.description, inline: false},
				{name: "Types", value: "**1**: "+pkmn.types.primary+type2instring(), inline: true},
				{name: "Abilities", value: "\n**1:** "+pkmn.ability.ability1.name+"\n**2:** "+pkmn.ability.ability2.name+"\n**Hidden:** "+pkmn.ability.hidden.name, inline: true},
				{name: "Base stats", value: "**Health: **"+pkmn.stats.health+"\n**Attack: **"+pkmn.stats.attack+"\n**Defence: **"+pkmn.stats.defence+"\n**Speed: **"+pkmn.stats.speed+"\n**Sp. Atk: **"+pkmn.stats.specialattack+"\n**Sp. Def: **"+pkmn.stats.specialdefence, inline: true},
				{name: "Appearance", value: "**Weight: **"+pkmn.bio.weight+"\n**Height: **"+pkmn.bio.height, inline: true},
				{name: "Egg group", value: egggroup(), inline: true},
				{name: "Catch rate", value: "**"+pkmn.catchrate+"**", inline: true},
			)
			.setFooter({text: "Information from bulbapedia.", iconURL: "https://archives.bulbagarden.net/media/upload/thumb/d/d4/Bulbapedia_bulb.png/60px-Bulbapedia_bulb.png"})
			.setColor(pkmn.pokedex.colour)

		interaction.reply({embeds: [dexentry], ephemeral: true})
	},
};
