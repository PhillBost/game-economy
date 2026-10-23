const Player = require("../agents/Player");
const Market = require("../market/Market");
const professions = require("../agents/professions");

class Simulation {

    constructor(playerCount) {

        this.day = 0;
        this.players = [];
        this.market = new Market(this.players);

        this.createPlayers(playerCount);
    }

    /**
     * randomly assigns players professions and creates a new 
     * simulation of `playerCount` players
     * @param {*} playerCount number of players initialized
     */
    createPlayers(playerCount) {
        const gatheringProfessions = ["miner", "lumberjack", "farmer"];
        const craftingProfessions = ["none", "smith"];

        for (let i = 0; i < playerCount; i++) {
            const gatheringProfession = gatheringProfessions[
                Math.floor(Math.random() * gatheringProfessions.length)
            ];
            const craftingProfession = craftingProfessions[
                Math.floor(Math.random() * craftingProfessions.length)
            ];

            this.players.push(
                new Player(i, gatheringProfession, craftingProfession)
            );
        }
    }

    /**
     * Iterates the day counter and processes each player's activities
     * by profession, then runs a market session for trading
     */
    runDay() {
        this.day++;

        const production = [];
        const crafting = [];
        const consumption = [];
        const transactionStart = this.market.transactions.length;

        for (const player of this.players) {
            consumption.push({
                playerId: player.id,
                resources: player.consumeDailyResources()
            });
            production.push({
                playerId: player.id,
                profession: player.gatheringProfession,
                resource: professions[player.gatheringProfession].gathers,
                quantity: this.processPlayer(player)
            });
            const craftingResult = player.craftDaily();
            crafting.push(...craftingResult.map(result => ({
                playerId: player.id,
                profession: player.craftingProfession,
                ...result
            })));
        }

        for (const player of this.players) {
            player.runProducerBehaviors(this.market);
        }

        for (const player of this.players) {
            player.runBuyerBehaviors(this.market);
        }

        this.market.matchOrders();

        const summary = {
            day: this.day,
            production,
            crafting,
            consumption,
            transactions: this.market.transactions.slice(transactionStart)
        };
        this.summarizeDay(summary);
        return summary;
    }

    summarizeDay(summary) {
        console.log(`\nDay ${summary.day} summary`);
        for (const entry of summary.production) {
            console.log(
                `Player ${entry.playerId} (${entry.profession}) produced ${entry.quantity} ${entry.resource}.`
            );
        }

        for (const entry of summary.crafting) {
            if (entry.quantity > 0) {
                const used = Object.entries(entry.inputs)
                    .map(([resource, quantity]) => `${quantity} ${resource}`).join(", ");
                console.log(`Player ${entry.playerId} (${entry.profession}) crafted ${entry.quantity} ${entry.resource} using ${used}.`);
            }
        }

        for (const entry of summary.consumption) {
            const used = Object.entries(entry.resources)
                .filter(([, quantity]) => quantity > 0)
                .map(([resource, quantity]) => `${quantity} ${resource}`);
            if (used.length > 0) {
                console.log(`Player ${entry.playerId} used ${used.join(", ")}.`);
            }
        }

        if (summary.transactions.length === 0) {
            console.log("No trades completed.");
            return;
        }

        for (const transaction of summary.transactions) {
            console.log(
                `Player ${transaction.buyerId} bought ${transaction.quantity} ${transaction.resource} from Player ${transaction.sellerId} at ${transaction.price}g each (${transaction.totalCost}g total).`
            );
        }
    }

    summarizeFinalState() {
        console.log(`\nFinal simulation summary (${this.day} days)`);

        for (const player of this.players) {
            console.log(
                `Player ${player.id} (${player.gatheringProfession}/${player.craftingProfession}): ` +
                `${player.gold}g, inventory ${JSON.stringify(player.inventory)}, ` +
                `${player.reservedGold}g reserved.`
            );
        }

        const tradedQuantity = this.market.transactions.reduce(
            (total, transaction) => total + transaction.quantity,
            0
        );
        const totalGoldTraded = this.market.transactions.reduce(
            (total, transaction) => total + transaction.totalCost,
            0
        );

        console.log(`Trades completed: ${this.market.transactions.length}`);
        console.log(`Resources traded: ${tradedQuantity}`);
        console.log(`Total trade value: ${totalGoldTraded}g`);
        console.log(`Open buy orders: ${this.market.buyOrders.length}`);
        console.log(`Open sell orders: ${this.market.sellOrders.length}`);
    }

    processPlayer(player) {
        const resource = professions[player.gatheringProfession].gathers;
        return player.produce(resource);
    }
}

module.exports = Simulation;
