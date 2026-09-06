import { describe, it, expect } from "vitest";
const Player = require("../src/agents/Player");

describe("Player", () => {

describe("Gold", () => {

    it("should reserve available gold", () => {
        // Arrange
        const player = new Player(1, "miner");

        // Act
        const result = player.reserveGold(250);

        // Assert
        expect(result).toBe(true);
        expect(player.gold).toBe(1000);
        expect(player.reservedGold).toBe(250);
        expect(player.getAvailableGold()).toBe(750);
    });


    it("should not reserve more gold than is available", () => {
        // Arrange
        const player = new Player(1, "miner");

        // Act
        const result = player.reserveGold(1001);

        // Assert
        expect(result).toBe(false);
        expect(player.reservedGold).toBe(0);
        expect(player.getAvailableGold()).toBe(1000);
    });


    it("should release reserved gold", () => {
        // Arrange
        const player = new Player(1, "miner");

        player.reserveGold(250);

        // Act
        player.releaseGold(100);

        // Assert
        expect(player.reservedGold).toBe(150);
        expect(player.getAvailableGold()).toBe(850);
    });

});


describe("Resources", () => {

    it("should reserve available resources", () => {
        // Arrange
        const player = new Player(1, "miner");

        player.inventory.iron = 20;

        // Act
        const result = player.reserveResource("iron", 5);

        // Assert
        expect(result).toBe(true);
        expect(player.inventory.iron).toBe(20);
        expect(player.reservedInventory.iron).toBe(5);
        expect(player.getAvailableResource("iron")).toBe(15);
    });


    it("should not reserve more resources than are available", () => {
        // Arrange
        const player = new Player(1, "miner");

        player.inventory.iron = 20;

        // Act
        const result = player.reserveResource("iron", 25);

        // Assert
        expect(result).toBe(false);
        expect(player.reservedInventory.iron).toBe(0);
        expect(player.getAvailableResource("iron")).toBe(20);
    });


    it("should release reserved resources", () => {
        // Arrange
        const player = new Player(1, "miner");

        player.inventory.iron = 20;
        player.reserveResource("iron", 10);

        // Act
        player.releaseResource("iron", 5);

        // Assert
        expect(player.reservedInventory.iron).toBe(5);
        expect(player.getAvailableResource("iron")).toBe(15);
    });

});


});
