// Compatibility view; player settings live in economy.js.
import { economy } from "../economy.js";

const craftingProfession = Object.fromEntries(
    Object.entries(economy.occupations)
        .filter(([, occupation]) => occupation.type === "crafting")
        .map(([name, occupation]) => [name, occupation.inventoryTargets || {}])
);

const craftingRates = Object.fromEntries(
    Object.entries(economy.occupations)
        .filter(([, occupation]) => occupation.type === "crafting")
        .map(([name, occupation]) => [
            name,
            Object.fromEntries((occupation.recipes || []).map(recipe => [recipe.id, recipe.ratePerDay]))
        ])
);

export default {
    inventoryTargets: {
        allPlayers: economy.player.inventoryTargets,
        craftingProfession
    },
    dailyConsumption: economy.player.dailyConsumption,
    craftingRates
};
