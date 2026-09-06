const Market = require("../src/market/Market");
const Player = require("../src/agents/Player")

const players = [
    new Player(1, "miner"),
    new Player(2, "farmer")
];

const buyer = players[0];
const seller = players[1];

// Give seller some iron
seller.inventory.iron = 20;

const market = new Market(players);

console.log("BEFORE");

console.log("Buyer:", buyer);
console.log("Seller:", seller);

// Buyer wants 10 iron at 25g
market.placeBuyOrder(
    buyer.id,
    "iron",
    10,
    25
);

// Seller offers 5 iron at 20g
market.placeSellOrder(
    seller.id,
    "iron",
    5,
    20
);

console.log("\nORDERS");

console.log(market.buyOrders);
console.log(market.sellOrders);

// Match them
market.matchOrders();

console.log("\nAFTER");

console.log("Buyer:", buyer);
console.log("Seller:", seller);

console.log("\nTRANSACTIONS");

console.log(market.transactions);


if (buyer.gold !== 900) {
    throw new Error("Buyer should have 900 gold.");
}

if (buyer.inventory.iron !== 5) {
    throw new Error("Buyer should have received 5 iron.");
}

if (buyer.reservedGold !== 125) {
    throw new Error("Buyer should have 125 gold reserved.");
}

if (seller.gold !== 1100) {
    throw new Error("Seller should have 1100 gold.");
}

if (seller.inventory.iron !== 15) {
    throw new Error("Seller should have 15 iron.");
}