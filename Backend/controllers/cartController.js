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
        console.log(cartId);
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
    try {
      const carts = await dml.readCarts();
      const users = await dml.readUsers();
      const cartId = await  parseInt(req.params.cartId);
      
      console.log(cartId);
      // Validate cartId
      if (isNaN(cartId)) {
        return res.status(400).json({ message: 'Invalid cartId' });
      }
  
      // Find the index of the cart to be deleted
      const cartIndex = carts.findIndex((cart) => cart.id === cartId);
        console.log(cartId);
      if (cartIndex === -1) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Get the owner's ID of the cart to be deleted
      const ownerId = carts[cartIndex].userId;
  
      // Remove the cart from the carts array
      const deletedCart = carts.splice(cartIndex, 1)[0];
  
      // Remove the deleted cart from the owner's carts list
      const ownerIndex = users.findIndex((user) => user.id === ownerId);
      if (ownerIndex !== -1) {
        const cartIndexInOwner = users[ownerIndex].carts.indexOf(cartId);
        if (cartIndexInOwner !== -1) {
          users[ownerIndex].carts.splice(cartIndexInOwner, 1);
        }
      }
  
      // Save the modified carts and users lists
      await dml.saveCarts(carts);
      await dml.saveUsers(users);
  
      res.status(200).json({ message: 'Cart deleted successfully', deletedCart });
    } catch (error) {
      console.error('Error deleting cart:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

exports.shareCart = async (req, res) => {
    try {
        const { cartId, userId } = req.body;
        const carts = await dml.readCarts();
        const users = await dml.readUsers();

        // Log the received data for debugging
        console.log('Received data:', { cartId, userId });

        const cartIndex = carts.findIndex(cart => cart.id === cartId);
        const userIndex = users.findIndex(user => user.id === userId);

        // Log the found indexes for debugging
        console.log('Cart index:', cartIndex);
        console.log('User index:', userIndex);

        if (cartIndex === -1 || userIndex === -1) {
            throw new Error('Cart or User not found');
        }

        // Check if carts[cartIndex] has the collaborators property
        if (!carts[cartIndex].collaborators) {
            carts[cartIndex].collaborators = []; // Initialize if it doesn't exist
        }

        carts[cartIndex].collaborators.push(userId);

        // Check if users[userIndex] has the collaborations property
        if (!users[userIndex].collaborations) {
            users[userIndex].collaborations = []; // Initialize if it doesn't exist
        }

        users[userIndex].collaborations.push(cartId);

        await dml.saveCarts(carts);
        await dml.saveUsers(users);

        res.json(carts);
        return { message: 'User added to cart successfully' };
    } catch (error) {
        console.error(`Error while adding User to cart: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.deleteProduct = async(req,res)=>{
    const carts = await dml.readCarts();
    const cartId = parseInt(req.params.cartId);
  const productId = parseInt(req.params.productId);
  // Find the cart by ID
  const cart = carts.find(cart => cart.id === cartId);
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  // Find the index of the product in the cart's products array
  const index = cart.products.findIndex(id => id === productId);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found in the cart' });
  }
  // Remove the product from the cart's products array
  cart.products.splice(index, 1);
  await dml.saveCarts(carts);
  res.status(200).json({ message: 'Product removed from cart successfully' });
}