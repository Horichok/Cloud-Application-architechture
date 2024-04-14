const { mod } = require('mathjs');
const fs = require('node:fs/promises');
const path = require("path");

const rootPath = path.dirname(process.mainModule.filename);
const dataPath = path.join(rootPath, "data");

console.log("rootPath=" + rootPath);
console.log("dataPath=" + dataPath);

const USERS = "users.json";
const CARTS = "carts.json";
const PRODUCTS = "products.json";


async function readDataRoutines(entityName) {
    const rawFileContent = await fs.readFile(path.join(dataPath, entityName));
    return JSON.parse(rawFileContent);
}

async function saveDataRoutines(entityName, items) {
    return await fs.writeFile(path.join(dataPath, entityName), JSON.stringify(items), { encoding: "utf-8" });
}

async function readUsers() {
    return await readDataRoutines(USERS);
}

async function readCarts() {
    return await readDataRoutines(CARTS);
}

async function readProducts() {
    return await readDataRoutines(PRODUCTS);
}

async function saveUsers(items) {
    return await saveDataRoutines(USERS, items);
}

async function saveCarts(items) {
    return await saveDataRoutines(CARTS, items);
}

async function saveProducts(items) {
    return await saveDataRoutines(PRODUCTS, items);
}

module.exports.readUsers = readUsers;
module.exports.readCarts = readCarts;
module.exports.readProducts = readProducts;

module.exports.saveUsers = saveUsers;
module.exports.saveCarts = saveCarts;
module.exports.saveProducts = saveProducts;