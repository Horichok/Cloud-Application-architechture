
class User {
    constructor(id, username,password) {
        this.id = id;
        this.username = username;
        this.carts = [];
        this.password = password;
        this.collaborations = [];
    }

    addCollaboration(cart){
        this.collaborations.push(cart);
    }

    removeCollaboration(cartId) {
        this.collaborations = this.collaborations.filter(cart => cart.id !== cartId);
    }

    addCart(cart) {
        this.carts.push(cart);
    }

    removeCart(cartId) {
        this.carts = this.carts.filter(cart => cart.id !== cartId);
    }
}

module.exports = User;
