const bcrypt = require('bcrypt');
const dml = require("../data/dataManagementLayer");
const User = require('../models/User');

// Number of salt rounds for hashing the password
const saltRounds = 10;



exports.createUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Hash the password
        var alreadyExist = false;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // Save the hashed password in the database
        const preUsers = await dml.readUsers();
        preUsers.forEach(e => {
            if (e.username === username)
            {   
                alreadyExist = true;
                res.json({message : 'Already exists'});
            }
        });
        if (alreadyExist)
            {
                await dml.saveUsers(preUsers);
                res.status(201);
            }
            else {
            const newUser = new User(preUsers.length + 1, username, hashedPassword);
            res.status(201).json(newUser);
            const allUsers = [newUser, ...preUsers];
            await dml.saveUsers(allUsers);
            }
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
};





exports.getUser = async (req, res) => {
    const userId = parseInt(req.params.userId); // Convert to number
    const users = await dml.readUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
}; 


exports.deleteUser = async (req, res) => {
    const users = await dml.readUsers();
    const userId = parseInt(req.params.userId);
    console.log(userId);
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({ message: 'user not found' });
    }
    users.splice(userIndex, 1);
    res.sendStatus(204);
    await dml.saveUsers(users)
}

exports.getUsers = async (req, res) => {
    const users = await dml.readUsers();
    res.json(users);
}



exports.getAllCarts = async (req, res) => {
    const userId = req.params.userId;
    const usersData = await dml.readUsers();
    const carts = await dml.readCarts();
    try {
        // Find the user by ID
        let userFound = null;
        for (const user of usersData) {
            if (user.id === parseInt(userId)) {
                userFound = user;
                break;
            }
        }

        // If user is not found, return error
        if (!userFound) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch all carts associated with the user
        const userCarts = userFound.carts.map(cartId => {
            return carts.find(cart => cart.id === cartId);
        });

        // Fetch all carts where the user is a collaborator
        const collaboratorCarts = usersData.reduce((accumulator, currentUser) => {
            if (currentUser.collaborations && currentUser.collaborations.includes(parseInt(userId))) {
                accumulator.push(...currentUser.carts.map(cartId => carts.find(cart => cart.id === cartId)));
            }
            return accumulator;
        }, []);

        // Combine user's carts and collaborator's carts
        const allCarts = [...userCarts, ...collaboratorCarts];

        res.json(allCarts);
    } catch (error) {
        console.error('Error fetching carts for user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


      


// -------------------------------REGISTRATION PART ------------------------------------------\\




exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
      // Check if the username already exists
      const users = await dml.readUsers();
      const userExists = users.some(user => user.username === username);
      if (userExists) {
          return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      // Save the hashed password in the database
      const preUsers = await dml.readUsers();
      const newUser = new User(preUsers.length + 1, username, hashedPassword);
      const allUsers = [newUser, ...preUsers];
      await dml.saveUsers(allUsers);
      res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Error registering user' });
  }
};
/*
exports.createUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if the username already exists
        const users = await dml.readUsers();
        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Save the user in the database
        const newUser = { username, password: hashedPassword };
        await dml.saveUser(newUser);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
};*/

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Retrieve user data from the database
        const users = await dml.readUsers();
        const user = users.find(user => user.username === username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Compare hashed password with the provided password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Authentication successful, return user data
        res.json({ message: 'Login successful', username: user.username });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }   
};