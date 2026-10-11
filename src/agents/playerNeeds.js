/**
 * Editable inventory targets and daily upkeep for players.
 * Profession-specific targets replace the shared target for that resource.
 */
module.exports = {
    inventoryTargets: {
        allPlayers: {
            wood: 5,
            iron: 5,
            wheat: 5,
            shovel: 1
        },
        craftingProfession: {
            smith: {
                iron: 10
            }
        }
    },
    dailyConsumption: {
        wood: 1
    }
};
