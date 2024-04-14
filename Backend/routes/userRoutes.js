// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define routes
router.get('/', userController.getUsers)
router.post('/create', userController.createUser);
router.get('/:userId', userController.getUser);
router.delete('/:userId/del', userController.deleteUser);

// Other user routes...

module.exports = router;
