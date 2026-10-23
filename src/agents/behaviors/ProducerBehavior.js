/**
 * allows players, as a producer/seller, decide
 * if they should sell a given resource or not.
 */
class ProducerBehavior {

    /**
     * Provided a given resource, and how much
     * of said resource a producer wants to keep
     * (targetInventory), what should we do?
     * @param {*} resource 
     * @param {*} targetInventory 
     */
    constructor(resource, targetInventory) {
        this.resource = resource;
        this.targetInventory = targetInventory;
    }

    /**
     * Based on the market and the player's inventory,
     * decide if we should sell a resource, and if so,
     * how much and at what price.
     * @param {*} player 
     * @param {*} market 
     * @returns 
     */
    decide(player, market) {
        const availableResource = 
            player.getAvailableResource(this.resource);

        // if we already have how much we want
        if (availableResource <= this.targetInventory) {
            return null;
        }

        // how much do we want to give away
        const quantity = availableResource - this.targetInventory;

        // find highest buy order from another player.
        const buyOrders = market.buyOrders.filter(order =>
            order.resource === this.resource &&
            order.status === "open" &&
            order.playerId !== player.id
        )

        const bestBuyOrder = buyOrders.reduce((best, order) => {
            if (best === null || order.price > best.price) {
                return order;
            }
            return best;
        }, null);
         
       return {
            type: "sell",
            resource: this.resource,
            quantity: quantity,
            price: bestBuyOrder ? bestBuyOrder.price : economy.resources[this.resource].baseValue
       }
    
    }

}

import { economy } from "../../economy.js";

export default ProducerBehavior;

