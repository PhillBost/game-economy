import { describe, it, expect } from "vitest";
const Order = require("../src/market/Order");

describe("Order", () => {

describe("fill()", () => {

    it("should partially fill an order", () => {
        // Arrange
        const order = new Order(
            1,
            1,
            "buy",
            "iron",
            10,
            25
        );

        // Act
        order.fill(4);

        // Assert
        expect(order.remainingQuantity).toBe(6);
        expect(order.status).toBe("open");
    });


    it("should completely fill an order", () => {
        // Arrange
        const order = new Order(
            1,
            1,
            "buy",
            "iron",
            10,
            25
        );

        // Act
        order.fill(10);

        // Assert
        expect(order.remainingQuantity).toBe(0);
        expect(order.status).toBe("filled");
    });


    it("should not allow a fill greater than the remaining quantity", () => {
        // Arrange
        const order = new Order(
            1,
            1,
            "buy",
            "iron",
            10,
            25
        );

        // Act & Assert
        expect(() => {
            order.fill(11);
        }).toThrow(
            "Cannot fill more than the remaining quantity."
        );
    });


    it("should not allow a fill of zero", () => {
        // Arrange
        const order = new Order(
            1,
            1,
            "buy",
            "iron",
            10,
            25
        );

        // Act & Assert
        expect(() => {
            order.fill(0);
        }).toThrow(
            "Fill quantity must be greater than zero."
        );
    });


    it("should not allow a negative fill", () => {
        // Arrange
        const order = new Order(
            1,
            1,
            "buy",
            "iron",
            10,
            25
        );

        // Act & Assert
        expect(() => {
            order.fill(-5);
        }).toThrow(
            "Fill quantity must be greater than zero."
        );
    });

});


describe("cancel()", () => {

    it("should cancel an open order", () => {
        // Arrange
        const order = new Order(
            1,
            1,
            "buy",
            "iron",
            10,
            25
        );

        // Act
        order.cancel();

        // Assert
        expect(order.status).toBe("cancelled");
    });


    it("should not allow a filled order to be cancelled", () => {
        // Arrange
        const order = new Order(
            1,
            1,
            "buy",
            "iron",
            10,
            25
        );

        order.fill(10);

        // Act & Assert
        expect(() => {
            order.cancel();
        }).toThrow(
            "Only open orders can be cancelled."
        );
    });

});

});
