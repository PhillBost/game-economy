const professions = {
    miner: {
        gathers: "iron"
    },
    farmer: {
        gathers: "wheat"
    },
    lumberjack: {
        gathers: "wood"
    },
    smith: {
        recipes: [
            {
                id: "shovel",
                inputs: { iron: 1, wood: 2},
                output: { resource: "shovel", quantity: 1 }
            }
        ]
    }
};

module.exports = professions;
