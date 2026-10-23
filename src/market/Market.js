import Order from "./Order.js";
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

        const order = new Order(
            this.nextOrderId++,
            playerId,
            "buy",
            resource,
            quantity,
            price,
        );

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

        const order = new Order(
            this.nextOrderId++,
            playerId,
            "sell",
            resource,
            quantity,
            price
        );

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
        while (this.buyOrders.length > 0 && this.sellOrders.length > 0) {
            let matchingPair = null;

            for (const buyOrder of this.buyOrders) {
                const sellOrder = this.sellOrders.find(order =>
                    order.resource === buyOrder.resource &&
                    order.price <= buyOrder.price &&
                    order.playerId !== buyOrder.playerId
                );
                if (sellOrder) {
                    matchingPair = { buyOrder, sellOrder };
                    break;
                }
            }

            if (!matchingPair) break;

            const { buyOrder, sellOrder } = matchingPair;

            this.executeTrade(buyOrder, sellOrder);

            if (buyOrder.status === "filled") {
                this.buyOrders = this.buyOrders.filter(order => order !== buyOrder);
            }

            if (sellOrder.status === "filled") {
                this.sellOrders = this.sellOrders.filter(order => order !== sellOrder);
            }
        }
    }

    executeTrade(buyOrder, sellOrder) {
        const buyer = this.getPlayer(buyOrder.playerId);
        const seller = this.getPlayer(sellOrder.playerId);

        const quantity = Math.min(buyOrder.remainingQuantity, sellOrder.remainingQuantity);

        const price = sellOrder.price;
        const totalCost = quantity * price;

        buyer.inventory[buyOrder.resource] += quantity;
        seller.inventory[buyOrder.resource] -= quantity;

        buyer.gold -= totalCost;
        seller.gold += totalCost;

        // buyer's reserved gold is released
        const reservedForTrade = quantity * buyOrder.price;
        buyer.releaseGold(reservedForTrade);

        // seller's reserved inventory is released
        seller.releaseResource(
            sellOrder.resource,
            quantity
        );

        // update orders
        buyOrder.fill(quantity);
        sellOrder.fill(quantity);

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
                order.remainingQuantity * order.price;

            player.releaseGold(remainingReserved);
        }

        if (order.type === "sell") {
            player.releaseResource(
                order.resource,
                order.remainingQuantity
            );
        }

        order.status = "closed";
    }

    cancelOrder(order) {
        const player = this.getPlayer(order.playerId);

        if (order.type === "buy") {
            const returnedGold = order.remainingQuantity * order.price;
            player.releaseGold(returnedGold)
        }

        if (order.type === "sell") {
            player.releaseResource(
                order.resource, 
                order.remainingQuantity
            );
        }
        
        order.cancel();
    }
}



export default Market;
