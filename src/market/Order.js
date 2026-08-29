class Order {
    constructor(id, playerId, resource, quantity, price) {
        this.id = id;
        this.playerId = playerId;

        this.type = type; // "buy, sell"

        this.resource = resource;
        this.quantity = quantity;
        this.price = price;

        this.status = "open";
    }
}

module.exports = Order;