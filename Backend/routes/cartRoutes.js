// routes/cartRoutes.js
// routes/cartRoutes.js

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Define routes
// Ajouter d'autres routes de panier...

// Route to add a product to a cart
router.get('/:cartId/products', cartController.getProducts);
router.delete('/:cartId/products/:productId',cartController.deleteProduct);


// Define routes
router.post('/add', cartController.addProductToCart)
router.post('/create', cartController.createCart);
router.get('/all', cartController.getAllCarts);
router.get('/:id', cartController.getCartById);
router.put('/:id/update', cartController.updateCart);
router.delete('/:cartId/del', cartController.deleteCart);
router.post('/share', cartController.shareCart);


module.exports = router;
