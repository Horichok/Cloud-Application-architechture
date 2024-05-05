// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cartRoutes = require('./routes/cartRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');


const app = express();
app.use(bodyParser.json());
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:3000', // Allow requests from this origin
};
  
app.use(cors(corsOptions));


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow the HTTP methods specified
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Allow the headers specified
    next();
});

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});