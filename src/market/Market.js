/**
 *  A Market object with arrays of `players` buy orders, sell
 * orders, and finished transactions.
 * 
 * To manage potentially hundreds of thousands of orders, we will likely 
 * change data structures for trading and order management.
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

        //sort for market timing, highest ask first
        this.buyOrders.sort((a, b) => {
            return b.price - a.price;
        })

        return order;
    }


    placeSellOrder(playerId, resource, quantity, price) {
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

        //sort for market timing, lowest ask first
        this.sellOrders.sort((a, b) => {
            return a.price - b.price;
        })

        return order;
    }

    /**
     * Continously executes trades of bestBuy and bestSell, since the order lists are
     * sorted. Once a transaction is not possible, we can confidently stop matching.
     */
    matchOrders() {
        while (
            this.buyOrders.length > 0 &&
            this.sellOrders.length > 0
        ) {
            const buyOrder = this.buyOrders[0];
            const sellOrder = this.sellOrders[0];

            if (buyOrder.price < sellOrder.price) {
                break;
            }

            this.executeTrade(buyOrder, sellOrder);

            if (buyOrder.status === "filled") {
                this.buyOrders.shift();
            }

            if (sellOrder.status === "filled") {
                this.sellOrders.shift();
            }
        }
    }

    executeTrade(buyOrder, sellOrder) {
        const buyer = this.getPlayer(buyOrder.playerId);
        const seller = this.getPlayer(sellOrder.playerId);

        const quantity = Math.min(buyOrder.quantity, sellOrder.quantity);

        const price = sellOrder.price;
        const totalCost = quantity * price;

        buyer.inventory[buyOrder.resource] += quantity;
        seller.inventory[buyOrder.resource] -= quantity;

        buyer.gold -= totalCost;
        seller.gold += totalCost;

        buyer.reservedGold -= totalCost;
        seller.reservedInventory[sellOrder.resource] -= quantity;

        buyOrder.quantity -= quantity;
        sellOrder.quantity -= quantity;

        if (buyOrder.quantity === 0) {
            buyOrder.status = "filled";
        }

        if(sellOrder.quantity === 0) {
            sellOrder.status = "filled";
        }

        this.transactions.push({
            buyerId: buyer.id,
            sellerId: seller.id,
            resource: buyOrder.resource,
            quantity,
            price,
            totalCost
        });
    }

    finalizeOrder(order) {
        const player = this.getPlayer(order.playerId);

        if (order.type === "buy") {
            const remainingReserved =
                order.quantity * order.price;

            player.releaseGold(remainingReserved);
        }

        if (order.type === "sell") {
            player.releaseResource(
                order.resource,
                order.quantity
            );
        }

        order.status = "closed";
    }
}



module.exports = Market;