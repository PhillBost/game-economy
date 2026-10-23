const professions = require("./professions");
const ProducerBehavior = require("./behaviors/ProducerBehavior");
const BuyerBehavior = require("./behaviors/BuyerBehavior");
const playerNeeds = require("./playerNeeds");

class Player {
    constructor(id, gatheringProfession, craftingProfession = "none") {
        if (!professions[gatheringProfession]) {
            throw new Error(`Unknown gathering profession: ${gatheringProfession}`);
        }

        this.id = id;
        this.gatheringProfession = gatheringProfession;
        this.craftingProfession = craftingProfession;
        this.profession = gatheringProfession;
        this.craftingProgress = {};

        this.gold = 100;

        //this will need to be updated to support a larger resource pool
        this.inventory = {
            wood: 0,
            iron: 0,
            wheat: 0,
            shovel: 0
        };

        this.reservedGold = 0;
        this.reservedInventory = {
            wood: 0,
            iron: 0,
            wheat: 0,
            shovel: 0
        };

        const targets = this.getInventoryTargets();
        this.producerBehaviors = Object.entries(targets)
            .map(([resource, target]) => new ProducerBehavior(resource, target));
        this.buyerBehaviors = Object.entries(targets)
            .map(([resource, target]) => new BuyerBehavior(resource, target));

    }

    /** Produce a random amount of the resource allowed by this player's profession. */
    produce(resource, minAmount = 1, maxAmount = 10) {
        if (resource !== professions[this.gatheringProfession].gathers) {
            throw new Error(`${this.gatheringProfession} cannot produce ${resource}.`);
        }
        if (!Number.isInteger(minAmount) || !Number.isInteger(maxAmount) ||
            minAmount < 0 || maxAmount < minAmount) {
            throw new Error("Production range must be non-negative integers with maxAmount >= minAmount.");
        }

        const amount = minAmount + Math.floor(Math.random() * (maxAmount - minAmount + 1));
        this.inventory[resource] += amount;
        return amount;
    }

    addProducerBehavior(behavior) {
        this.producerBehaviors.push(behavior);
    }

    addBuyerBehavior(behavior) {
        this.buyerBehaviors.push(behavior);
    }

    getInventoryTargets() {
        const targets = { ...playerNeeds.inventoryTargets.allPlayers };
        const overrides = playerNeeds.inventoryTargets.craftingProfession[
            this.craftingProfession
        ] || {};
        return { ...targets, ...overrides };
    }

    consumeDailyResources() {
        const consumed = {};
        for (const [resource, amount] of Object.entries(playerNeeds.dailyConsumption)) {
            const used = Math.min(this.inventory[resource] || 0, amount);
            this.inventory[resource] = (this.inventory[resource] || 0) - used;
            consumed[resource] = used;
        }
        return consumed; 
    }

    /** Craft each configured recipe at its own rate. Partial daily rates accumulate. */
    craftDaily() {
        const recipes = professions[this.craftingProfession]?.recipes || [];
        const rates = playerNeeds.craftingRates[this.craftingProfession] || {};
        const crafted = [];

        for (const recipe of recipes) {
            const rate = rates[recipe.id] ?? 0;
            if (!Number.isFinite(rate) || rate < 0) {
                throw new Error(`Crafting rate for ${this.craftingProfession}.${recipe.id} must be non-negative.`);
            }
            this.craftingProgress[recipe.id] = (this.craftingProgress[recipe.id] || 0) + rate;

            /** Add crafting progress daily as rate, then consume crafted items into inventory */
            let quantity = 0;
            const inputs = {};
            while (this.craftingProgress[recipe.id] >= 1 && Object.entries(recipe.inputs).every(
                ([resource, amount]) => this.getAvailableResource(resource) >= amount
            )) {
                for (const [resource, amount] of Object.entries(recipe.inputs)) {
                    this.inventory[resource] -= amount;
                    inputs[resource] = (inputs[resource] || 0) + amount;
                }
                quantity += recipe.output.quantity;
                this.craftingProgress[recipe.id] -= 1;
            }

            this.inventory[recipe.output.resource] =
                (this.inventory[recipe.output.resource] || 0) + quantity;
            crafted.push({ recipe: recipe.id, resource: recipe.output.resource, quantity, inputs });
        }

        return crafted;
    }

    /** Ask each buyer behavior for a proposal and place any resulting orders. */
    runBuyerBehaviors(market) {
        const orders = [];
        for (const behavior of this.buyerBehaviors) {
            const decision = behavior.decide(this, market);
            if (decision?.type === "buy") {
                orders.push(market.placeBuyOrder(
                    this.id,
                    decision.resource,
                    decision.quantity,
                    decision.price
                ));
            }
        }
        return orders;
    }

    /** Ask each producer behavior for a sell proposal and place any resulting orders. */
    runProducerBehaviors(market) {
        const orders = [];
        for (const behavior of this.producerBehaviors) {
            const decision = behavior.decide(this, market);
            if (decision?.type === "sell") {
                orders.push(market.placeSellOrder(
                    this.id,
                    decision.resource,
                    decision.quantity,
                    decision.price
                ));
            }
        }
        return orders;
    }

    getAvailableGold() {
        return this.gold - this.reservedGold;
    }

    getAvailableResource (resource) {
        return (
            this.inventory[resource] - this.reservedInventory[resource]
        )
    }

    reserveGold(amount) {
        if (this.getAvailableGold() < amount) {
            return false;
        }

        this.reservedGold += amount;
        return true;
    }

    releaseGold(amount) {
        this.reservedGold -= amount;
    }

    reserveResource(resource, amount) {
        if (this.getAvailableResource(resource) < amount) {
            return false;
        }

        this.reservedInventory[resource] += amount;
        return true;
    }

    releaseResource(resource, amount) {
        this.reservedInventory[resource] -= amount;
    }
}

module.exports = Player;
