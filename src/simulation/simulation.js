const Player = require("../agents/Player");

class Simulation {

    constructor(playerCount) {

        this.day = 0;
        this.players = [];

        this.createPlayers(playerCount);
    }

    /**
     * randomly assigns players professions and creates a new 
     * simulation of `playerCount` players
     * @param {*} playerCount number of players initialized
     */
    createPlayers(playerCount) {
        const professions = ["miner", "lumberjack", "farmer"];

        for (let i = 0; i < playerCount; i++) {
            const profession = 
                professions[Math.floor(Math.random() * professions.length)];

            this.players.push(
                new Player(i, profession)
            );
        }
    }

    runDay() {
        this.day++;

        console.log(`Day ${this.day}`);

        for (const player of this.players) {
            this.processPlayer(player);
        }
    }

    processPlayer(player) {
        switch(player.profession) {
            case "miner":
                player.inventory.iron += 10;
                break;

            case "lumberjack":
                player.inventory.wood += 10;
                break;

            case "farmer":
                player.inventory.wheat += 10;
                break;
            
        }
    }
}

module.exports = Simulation;