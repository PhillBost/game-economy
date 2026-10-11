/** Decides whether a player should buy a resource to reach a target inventory. */
class BuyerBehavior {
    constructor(resource, targetInventory) {
        this.resource = resource;
        this.targetInventory = targetInventory;
    }

    decide(player, market) {
        const availableResource = player.getAvailableResource(this.resource);
        const alreadyOrdered = market.buyOrders
            .filter(order => order.playerId === player.id &&
                order.resource === this.resource &&
                order.status === "open")
            .reduce((total, order) => total + order.remainingQuantity, 0);
        const quantityNeeded = this.targetInventory - availableResource - alreadyOrdered;

        if (quantityNeeded <= 0) {
            return null;
        }

        const sellOrders = market.sellOrders.filter(order =>
            order.resource === this.resource &&
            order.status === "open" &&
            order.playerId !== player.id
        );

        if (sellOrders.length === 0) {
            return null;
        }

        const bestSellOrder = sellOrders.reduce((best, order) =>
            order.price < best.price ? order : best
        );
        const affordableQuantity = Math.floor(
            player.getAvailableGold() / bestSellOrder.price
        );
        const quantity = Math.min(quantityNeeded, affordableQuantity);

        if (quantity <= 0) {
            return null;
        }

        return {
            type: "buy",
            resource: this.resource,
            quantity,
            price: bestSellOrder.price
        };
    }
}

module.exports = BuyerBehavior;
