/**
 * Central definitions for the economy. Add resources, occupations, recipes,
 * inventory targets, and per-player consumption here.
 */
export const economy = {
    resources: {
        wood: { name: "Wood", baseValue: 10 },
        iron: { name: "Iron", baseValue: 20 },
        wheat: { name: "Wheat", baseValue: 5 },
        shovel: { name: "Shovel", baseValue: 40 },
        bread: { name: "Bread", baseValue: 15 }
    },
    occupations: {
        miner: { type: "gathering", gathers: "iron", productionRange: { min: 1, max: 10 } },
        farmer: { type: "gathering", gathers: "wheat", productionRange: { min: 1, max: 10 } },
        lumberjack: { type: "gathering", gathers: "wood", productionRange: { min: 1, max: 10 } },
        smith: {
            type: "crafting",
            inventoryTargets: { iron: 10 },
            recipes: [{
                id: "shovel",
                inputs: { iron: 1, wood: 2 },
                output: { resource: "shovel", quantity: 1 },
                ratePerDay: 1
            }]
        },
        baker: {
            type: "crafting",
            inventoryTargets: { wheat: 5 },
            recipes: [{
                id: "bread",
                inputs: { wheat: 2 },
                output: { resource: "bread", quantity: 1 },
                ratePerDay: 2
            }]
        }
    },
    player: {
        startingGold: 100,
        inventoryTargets: {
            wood: 5,
            iron: 5,
            wheat: 5,
            bread: 1,
            shovel: 1
        },
        dailyConsumption: {
            wood: 1,
            shovel: 0.05,
            bread: 0.5
        }
    }
};

function assertResourceExists(resource, context) {
    if (!economy.resources[resource]) {
        throw new Error(`${context} refers to unknown resource "${resource}".`);
    }
}

for (const [name, occupation] of Object.entries(economy.occupations)) {
    if (occupation.type === "gathering") {
        assertResourceExists(occupation.gathers, `Occupation "${name}"`);
    }
    for (const [resource, amount] of Object.entries(occupation.inventoryTargets || {})) {
        assertResourceExists(resource, `Inventory target for "${name}"`);
        if (!Number.isFinite(amount) || amount < 0) {
            throw new Error(`Inventory target for "${name}.${resource}" must be non-negative.`);
        }
    }
    for (const recipe of occupation.recipes || []) {
        for (const resource of Object.keys(recipe.inputs)) {
            assertResourceExists(resource, `Recipe "${name}.${recipe.id}" input`);
        }
        assertResourceExists(recipe.output.resource, `Recipe "${name}.${recipe.id}" output`);
        if (!Number.isFinite(recipe.ratePerDay) || recipe.ratePerDay < 0) {
            throw new Error(`Crafting rate for "${name}.${recipe.id}" must be non-negative.`);
        }
    }
}

for (const [resource, amount] of Object.entries(economy.player.inventoryTargets)) {
    assertResourceExists(resource, "Shared inventory target");
    if (!Number.isFinite(amount) || amount < 0) {
        throw new Error(`Inventory target for "${resource}" must be non-negative.`);
    }
}

for (const [resource, amount] of Object.entries(economy.player.dailyConsumption)) {
    assertResourceExists(resource, "Daily consumption");
    if (!Number.isFinite(amount) || amount < 0) {
        throw new Error(`Daily consumption for "${resource}" must be non-negative.`);
    }
}
