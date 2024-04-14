// routes/cartRoutes.js
// routes/cartRoutes.js

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Define routes
// Ajouter d'autres routes de panier...

// Route to add a product to a cart
router.get('/:cartId/products', cartController.getProducts);


// Define routes
router.post('/add', cartController.addProductToCart)
router.post('/create', cartController.createCart);
router.get('/all', cartController.getAllCarts);
router.get('/:id', cartController.getCartById);
router.put('/:id/update', cartController.updateCart);
router.delete('/:id/del', cartController.deleteCart);
router.post('/share', cartController.shareCart);

module.exports = router;
