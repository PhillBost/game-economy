/**
 *  Represents a Market object with arrays of buy orders, sell
 * orders, and finished transactions.
 */
class Market {
    constructor(players) {
        this.players = players;

        this.buyOrders = [];
        this.sellOrders = [];
        this.transactions = [];

        this.nextOrderId = 1;
    }

    getPlayer(playerId) {
        return this.players.find(
            player => player.id === playerId
        );
    }

    placeBuyOrder(playerId, resource, quantity, price) {
        const player = this.getPlayer(playerId);

        if (!player) {
            throw new Error("Player not found.");
        }

        const totalCost = quantity * price;

        if (!player.reserveGold(totalCost)) {
            throw new Error("Insufficient available gold.");
        }

        const order = {
            id: this.nextOrderId++,
            playerId,
            type: "buy",
            resource,
            quantity,
            price,
            status: "open"
        };

        this.buyOrders.push(order);

        return order;
    }


    placeSellOrder(order) {
        const player = this.getPlayer(playerId);

        if (!player) {
            throw new Error("Player not found.");
        }

        if (!player.reserveResource(resource, quantity)) {
            throw new Error(
                `Insufficient available ${resource}.`
            );
        }

        const order = {
            id: this.nextOrderId++,
            playerId,
            type: "sell",
            resource,
            quantity,
            price,
            status: "open"
        };

        this.sellOrders.push(order);

        return order;
    }

    /**
     * Does a simple O(n^2) search of buy and sell orders, creating an order 
     * match if resource matches requirements and total price is less than buyers max
     */
    matchOrders() {

        //this is inefficient and bad but we will optimize later

        for (let i = 0; i < this.buyOrders.length; i++) {
            const buyOrder = this.buyOrders[i];

            for (let j = 0; j < this.sellOrders.length; j++) {
                const sellOrder = this.sellOrders[j];

                if (
                    buyOrder.resource === sellOrder.resource &&
                    buyOrder.price >= sellOrder.price
                ) {
                    const quantity = Math.min(
                        buyOrder.quantity,
                        sellOrder.quantity
                    );

                    const price = sellOrder.price;

                    const totalCost = quantity * price;

                    console.log(
                        `Trade: ${quantity} ${buyOrder.resource} @ ${price}g`
                    );

                    buyOrder.quantity -= quantity;
                    sellOrder.quantity -= quantity;

                    this.transactions.push({
                        resource: buyOrder.resource,
                        quantity,
                        price,
                        totalCost,
                        buyerId: buyOrder.playerId,
                        sellerId: sellOrder.playerId
                    });
                }
            }
        }
    }
}



module.exports = Market;