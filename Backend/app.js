// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cartRoutes = require('./routes/cartRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');


const app = express();
app.use(bodyParser.json());
app.use(express.json());


// Use cart and product routes
app.use('/carts', cartRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);



app.get("/health", (req, res, next) => {
    res.send("<h1>Service is OK!</h1>");
});


// Define route handler for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to E-cart backend!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});