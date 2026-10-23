import { describe, it, expect} from "vitest";
const Market = require("../src/market/Market");
const Player = require("../src/agents/Player");

describe("Market", () => {
    it("should partially fill a buy order", () => {


        const players = [
            new Player(1, "miner"),
            new Player(2, "farmer")
        ];

        const buyer = players[0];
        const seller = players[1];
        buyer.gold = 500;
        seller.gold = 200;

        // Give seller some iron
        seller.inventory.iron = 20;

        const market = new Market(players);


        // Buyer wants 10 iron at 25g
        const buyOrder = market.placeBuyOrder(
            buyer.id,
            "iron",
            10,
            25
        );

        // Seller offers 5 iron at 20g
        const sellOrder = market.placeSellOrder(
            seller.id,
            "iron",
            5,
            20
        );

        market.matchOrders();

        // Assert
        expect(buyer.gold).toBe(400);
        expect(buyer.inventory.iron).toBe(5);
        expect(buyer.reservedGold).toBe(125);

        expect(seller.gold).toBe(300);
        expect(seller.inventory.iron).toBe(15);

        expect(buyOrder.remainingQuantity).toBe(5);
        expect(buyOrder.status).toBe("open");

        expect(sellOrder.remainingQuantity).toBe(0);
        expect(sellOrder.status).toBe("filled");

        expect(market.transactions).toHaveLength(1);
    });
});
