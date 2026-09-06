class Order {
    /**
     * An order object attached to a playerId 
     * that can be either a buy or sell order of a given
     * resource, quantity, and price per resource.
     * @param {*} id 
     * @param {*} playerId 
     * @param {*} resource 
     * @param {*} quantity 
     * @param {*} price 
     */
    constructor(id, playerId, type, resource, quantity, price) {
        this.id = id;
        this.playerId = playerId;

        this.type = type; // "buy, sell"

        this.resource = resource;
        this.originalQuantity = quantity;
        this.remainingQuantity = quantity;

        this.price = price;

        this.status = "open";

        /* Eventually will handle this with a time manager */
        this.createdAt = 1;
    }

    /**
     * Fills order. If given`quantity` meets necessary conditions. Subtracts
     * given quantity from remaining quantity available for order. 
     * @param {*} quantity 
     */
    fill(quantity) {
        if (quantity <= 0) {
            throw new Error("Fill quantity must be greater than zero.");
        }

        if (quantity > this.remainingQuantity) {
            throw new Error("Cannot fill more than the remaining quantity.")
        }

        this.remainingQuantity -= quantity;

        /* Ensures order doesn't close if seller still has resource to sell */
        if (this.remainingQuantity === 0) {
            this.status = "filled"
        }
    }

    cancel() {
        if (this.status !== "open") {
            throw new Error(
                "Only open orders can be cancelled."
            );
        }

        this.status = "cancelled";
    }


}

module.exports = Order;