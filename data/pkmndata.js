const colourData = require("../data/colourdata.js")
const typeData = require("../data/typedata.js")
const levelgroupData = require("../data/levelgroup.js")
const abilityData = require("../data/abilitydata.js")
const eggData = require("../data/eggdata.js")

let pokemon = class {
    constructor(
        name, id,
        lvlspeed, 
        types, 
        basestats, 
        learnmoveset, tmmoveset, 
        evolution, 
        abilities, 
        bio, 
        ondefeat, 
        friendshipbase, 
        egginfo, 
        malepercentage, 
        catchrate,
        pokedex,
        battleEncounter
        ) {

        this.name = name //name
        this.id = id
        this.lvlspeed = lvlspeed //one of the 6 lvl speeds

        this.types = types

        this.stats = basestats, //health

        this.learnmoveset = learnmoveset, //nil if no moves
        this.tmmoveset = tmmoveset, //nil if no moves

        this.evolution = evolution, //nil if no evolution

        this.ability = abilities, //ability 1

        this.bio = bio, //weight

        this.friendship = friendshipbase, //base friendship

        this.ondefeat = ondefeat, //ev yield

        this.egg = egginfo

        this.pokedex = pokedex

        this.malepercentage = malepercentage

        this.catchrate = catchrate

        this.battleEncounter = battleEncounter
      }
}

function evyieldgen(health, attack, defence, speed, specialattack, specialdefence) {
    return [health, attack, defence, speed, specialattack, specialdefence]
}

const ivysaur = new pokemon(
    "Ivysaur",
    2,
    levelgroupData.Medium_Slow,
    {primary: typeData.Grass, secondary: typeData.Poison},
    {health: 60, attack: 62, defence: 63, specialattack: 80, specialdefence: 80, speed: 60},
    [], //learn moveset
    [], //tm moveset
    {}, //evolution
    {ability1: abilityData.Overgrow, ability2: abilityData.None, hidden: abilityData.Chlorophyll},
    {weight: "13.0kg", height: "1.0m"},
    {evyield: evyieldgen(0, 0, 0, 0, 1, 1), xpyield: 142},
    70, //friendship base
    {group1: eggData.Monster, group2: eggData.Grass, hatchstepmin: 5140, hatchstepmax: 5396},
    87.5, //male percentage
    45, //catchrate
    {pokemonsynopsys: "Seed Pokemon", 
    colour: colourData.Green, 
    description: "When the bud on its back starts swelling, a sweet aroma wafts to indicate the flower's coming bloom."},
    false
)

const bulbasaur = new pokemon(
    "Bulbasaur",
    1,
    levelgroupData.Medium_Slow,
    {primary: typeData.Grass, secondary: typeData.Poison},
    {health: 45, attack: 49, defence: 49, specialattack: 65, specialdefence: 65, speed: 45},
    [], //learn moveset
    [], //tm moveset
    {pokemon: ivysaur, evolvesif: (pokemon, level, evolve, channel) => {
        //evolves if
        if (level >= 16) {
            evolve()
        }
    }},
    {ability1: abilityData.Overgrow, ability2: abilityData.None, hidden: abilityData.Chlorophyll},
    {weight: "6.9kg", height: "0.7m"},
    {evyield: evyieldgen(0, 0, 0, 0, 1, 0), xpyield: 64},
    70, //friendship base
    {group1: eggData.Monster, group2: eggData.Grass, hatchstepmin: 5140, hatchstepmax: 5396},
    87.5, //male percentage
    45, //catchrate
    {pokemonsynopsys: "Seed Pokemon", 
    colour: colourData.Green, 
    description: "For some time after its birth, it grows by taking nourishment from the seed on its back."},
    false
)

module.exports = {
    Pokemon: [
        bulbasaur,
        ivysaur
    ]
}