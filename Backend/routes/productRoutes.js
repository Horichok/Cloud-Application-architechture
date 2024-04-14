// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Define routes
router.post('/create', productController.createProduct);
router.get('/all', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id/update', productController.updateProduct);
router.delete('/:id/del', productController.deleteProduct);

module.exports = router;
