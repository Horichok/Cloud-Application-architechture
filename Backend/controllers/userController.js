// controllers/userController.js
const dml = require("../data/dataManagementLayer");
const User = require('../models/User');


exports.createUser = async (req, res) => {
    const { name } = req.body;
    const preUsers = await dml.readUsers();
    const newUser = new User(preUsers.length + 1, name);
    res.status(201).json(newUser);
    const allUsers = [newUser, ...preUsers];
    await dml.saveUsers(allUsers);
};

exports.getUser = async (req, res) => {
    const users = await dml.readUsers();
    const userId = parseInt(req.params.userId);
    const user = users.find(user => user.id === userId);
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