const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes pour la création, la récupération et la suppression des utilisateurs
router.get('/all',userController.getUsers);
router.post('/create', userController.createUser);
router.get('/:userId/allcarts',userController.getAllCarts);
router.get('/:userId', userController.getUser);
router.delete('/:userId/del', userController.deleteUser);

// Routes pour l'enregistrement et la connexion des utilisateurs
router.post('/register', userController.registerUser);
router.post('/login', userController.login);

module.exports = router;



