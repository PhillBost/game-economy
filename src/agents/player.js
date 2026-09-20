class Player {
    constructor(id, profession) {
        this.id = id;
        this.profession = profession;

        this.gold = 1000;

        //this will need to be updated to support a larger resource pool
        this.inventory = {
            wood: 0,
            iron: 0,
            wheat: 0
        };

        this.reservedGold = 0;
        this.reservedInventory = {
            wood: 0,
            iron: 0,
            wheat: 0
        };

        this.producerBehaviors = [];

    }

    getAvailableGold() {
        return this.gold - this.reservedGold;
    }

    getAvailableResource (resource) {
        return (
            this.inventory[resource] - this.reservedInventory[resource]
        )
    }

    reserveGold(amount) {
        if (this.getAvailableGold() < amount) {
            return false;
        }

        this.reservedGold += amount;
        return true;
    }

    releaseGold(amount) {
        this.reservedGold -= amount;
    }

    reserveResource(resource, amount) {
        if (this.getAvailableResource(resource) < amount) {
            return false;
        }

        this.reservedInventory[resource] += amount;
        return true;
    }

    releaseResource(resource, amount) {
        this.reservedInventory[resource] -= amount;
    }
}

module.exports = Player;