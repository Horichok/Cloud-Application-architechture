// controllers/productController.js
// controllers/productController.js
const dml = require("../data/dataManagementLayer");
const Product = require('../models/Product');


exports.createProduct = async (req, res) => {
    const { name, price } = req.body;
    const pre = await dml.readProducts();

    const newProduct = new Product(pre.length + 1, name, price, 1);
    res.status(201).json(newProduct);
    const all = [newProduct, ...pre];
    await dml.saveProducts(all);
};


exports.getAllProducts = async (req, res) => {
    const products = await dml.readProducts();
    res.json(products);
};

exports.getProductById = async (req, res) => {
    const products = await dml.readProducts();
    const productId = parseInt(req.params.id);
    const product = products.find(product => product.id === productId);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
};

exports.updateProduct = async (req, res) => {
    const products = await dml.readProducts();
    const productId = parseInt(req.params.id);
    const { name, price } = req.body;
    const productIndex = products.findIndex(product => product.id === productId);
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }
    products[productIndex] = { id: productId, name, price };
    res.json(products[productIndex]);
    await dml.saveProducts(products)

};

exports.deleteProduct = async (req, res) => {
    const productId = parseInt(req.params.id);
    
    // Remove the product from all carts
    const carts = await dml.readCarts();
    carts.forEach(cart => {
        let index;
        while ((index = cart.products.indexOf(productId)) !== -1) {
            cart.products.splice(index, 1);
        }
    });
    await dml.saveCarts(carts);

    // Remove the product from the list of products
    const products = await dml.readProducts();
    const productIndex = products.findIndex(product => product.id === productId);
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }
    products.splice(productIndex, 1);
    await dml.saveProducts(products);

    res.json(products);
};


