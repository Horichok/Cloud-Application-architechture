// models/Cart.js

class Cart {
    constructor(id, name, userId) {
        this.id = id;
        this.name = name;
        this.userId = userId;
        this.collaborators = [];
        this.products = []; // Array to store product IDs
    }

    addProduct(productId) {
        this.products.push(productId);
    }

    removeProduct(productId) {
        this.products = this.products.filter(id => id !== productId);
    }
}

module.exports = Cart;
