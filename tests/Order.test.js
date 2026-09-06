const Order = require("../src/market/Order");

/** Partially Filled Order */
const order = new Order(
    1,
    1,
    "buy",
    "iron",
    10,
    25
)

order.fill(4);

if (order.remainingQuantity !== 6) {
    throw new Error("Expected 6 units remaining.");
}

if (order.status !== "open") {
    throw new Error("Expected order to remain open after partial fill.");
}

console.log("✓ Partial fill test passed");

/** Completed Order */
const completedOrder = new Order(
    2,
    1,
    "buy",
    "iron",
    10,
    25
);

completedOrder.fill(10);

if (completedOrder.remainingQuantity !== 0) {
    throw new Error("Expected 0 units remaining.");
}

if (completedOrder.status !== "filled") {
    throw new Error("Expected order to be filled.");
}

console.log("✓ Complete fill test passed");

/** Invalid Order */
const invalidOrder = new Order(
    3,
    1,
    "buy",
    "iron",
    10,
    25
);

try {
    invalidOrder.fill(11);
    throw new Error("Expected fill to throw an error.");
} catch (error) {
    if (error.message !== "Cannot fill more than the remaining quantity.") {
        throw error;
    }
}

console.log("✓ Invalid fill test passed");