const typeData = require("../data/typedata.js")
const weatherData = require("../data/weatherdata.js")

module.exports = {
    None: {
        name: "None",
        description: "This pokemon has no special ability.",
    },
    Overgrow: {
        name: "Overgrow",
        description: "Powers up Grass-type moves when the Pokémon's HP is low",
        afterturn: (pokemon, enemy, scene) => {
            
        },
        beforemove: (pokemon, enemy, scene, move) => {
            if (pokemon.current.health <= (pokemon.stats.health / 3)) {
                if (move.type == typeData.Grass) {
                    move.power *= 2
                }
            } 
        }
    },
    Chlorophyll: {
        name: "Chlorophyll",
        description: "Boosts the Pokémon's Speed stat in harsh sunlight.",
        beforeturn: (pokemon, enemy, scene) => {

        },
        beforemove: (pokemon, enemy, scene, move) => {
            if (scene.weather == weatherData.Sun || scene.weather == weatherData.Extreme_sun) {
                pokemon.abilitystats.speed *= 2
            }
        }
    },
}