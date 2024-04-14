
class User {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.carts = [];
    }

    addCart(cart) {
        this.carts.push(cart);
    }

    removeCart(cartId) {
        this.carts = this.carts.filter(cart => cart.id !== cartId);
    }
}

module.exports = User;
