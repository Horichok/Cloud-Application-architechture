// controllers/cartController.js
// controllers/cartController.js
const dml = require("../data/dataManagementLayer");
const Cart = require('../models/Cart');


exports.createCart = async (req, res) => {
    const { name, userId } = req.body;
    const pre = await dml.readCarts();
    const users = await dml.readUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    const cartId = userId * 1000 + pre.length + 1;
    users[userIndex].carts.push(cartId);
    const newCart = new Cart(cartId, name, userId);
    newCart.collaborators.push(userId);
    res.status(201).json(newCart);
    const all = [newCart, ...pre];
    await dml.saveCarts(all);
    await dml.saveUsers(users);

};


exports.getProducts = async (req, res) => {
    try {
        const { cartId } = req.body;
        console.log(cartId);
        const carts = await dml.readCarts();

        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }

        const products = await dml.readProducts();

        const productsInCart = products.filter(product => cart.products.includes(product.id));
        console.log(productsInCart)
        res.json(productsInCart);
        return { productsInCart };

    } catch (error) {
        throw new Error(`Error while getting products in cart: ${error.message}`);
    }
};



exports.getAllCarts = async (req, res) => {
    const carts = await dml.readCarts();
    res.json(carts);
};

exports.addProductToCart = async (req, res) => {
    try {
        const { cartId, productId } = req.body
        // Lire tous les paniers
        const carts = await dml.readCarts();

        // Trouver le panier avec l'ID spécifié
        const cartIndex = carts.findIndex(cart => cart.id === cartId);
        if (cartIndex === -1) {
            throw new Error('Cart not found');
        }

        // Ajouter l'ID du produit dans le tableau des produits du panier
        carts[cartIndex].products.push(productId);

        // Enregistrer les modifications dans le fichier JSON des paniers
        await dml.saveCarts(carts);
        res.json(carts);
        return { message: 'Product added to cart successfully' };
    } catch (error) {
        throw new Error(`Error while adding product to cart: ${error.message}`);
    }
};

exports.getCartById = async (req, res) => {
    const cartId = parseInt(req.params.id);
    const carts = await dml.readCarts();
    const cart = carts.find(cart => cart.id === cartId);
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart);
};

exports.updateCart = async (req, res) => {
    const carts = await dml.readCarts();
    const cartId = parseInt(req.params.id);
    console.log(cartId);
    const { name, collaborators, products } = req.body;

    const cartIndex = carts.findIndex(cart => cart.id === cartId);
    if (cartIndex === -1) {
        return res.status(404).json({ message: 'Cart not found' });
    }
    carts[cartIndex] = { id: cartId, name, collaborators, products };
    res.json(carts[cartIndex]);
    await dml.saveCarts(carts);
};

exports.deleteCart = async (req, res) => {
    const cartId = parseInt(req.params.id);
    const carts = await dml.readCarts();
    const cartIndex = carts.findIndex(cart => cart.id === cartId);
    if (cartIndex === -1) {
        return res.status(404).json({ message: 'Cart not found' });
    }
    carts.splice(cartIndex, 1);
    res.json(carts);
    await dml.saveCarts(carts);
};

exports.shareCart = async (req, res) => {
    try {
        const { cartId, userId } = req.body
        const carts = await dml.readCarts();

        const cartIndex = carts.findIndex(cart => cart.id === cartId);
        if (cartIndex === -1) {
            throw new Error('Cart not found');
        }

        carts[cartIndex].collaborators.push(userId);

        await dml.saveCarts(carts);
        res.json(carts);
        return { message: 'User added to cart successfully' };
    } catch (error) {
        throw new Error(`Error while adding User to cart: ${error.message}`);
    }
};
