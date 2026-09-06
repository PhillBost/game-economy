/** Player Reserve Gold */
const Player = require("../src/agents/Player");

const player = new Player(1, "miner");

player.reserveGold(250);

if (player.gold !== 1000) {
    throw new Error("Total gold should remain 1000.");
}

if (player.reservedGold !== 250) {
    throw new Error("Expected 250 gold to be reserved.");
}

if (player.getAvailableGold() !== 750) {
    throw new Error("Expected 750 gold to be available.");
}

console.log("✓ Gold reservation test passed");

/** Player Release Gold */
player.releaseGold(100);

if (player.reservedGold !== 150) {
    throw new Error("Expected 150 gold to remain reserved.");
}

if (player.getAvailableGold() !== 850) {
    throw new Error("Expected 850 gold to be available.");
}

console.log("✓ Gold release test passed");