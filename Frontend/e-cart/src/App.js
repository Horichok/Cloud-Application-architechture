import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './routes/Navbar/Navbar';
import Home from './routes/regLogHome/Home';
import AllCarts from './routes/carts/AllCarts';
import Login from './routes/regLogHome/Login';
import Register from './routes/regLogHome/Register';
import CartDetail from './routes/carts/CartDetail';
import AllUser from './routes/users/AllUser';
import AllProducts from './routes/products/AllProducts';
import CreateCart from './routes/carts/CreateCart';
import AddProductToCart from './routes/carts/AddProductToCart';
import UserDetails from './routes/users/UserDetails';


function App() {
  // State to track user's authentication status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // State to store the username
  const [username, setUsername] = useState('');

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} />
      <Routes>
        {/* Pass username as a prop to Home component */}
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} username={username} />} />
        <Route path="/carts" element={<AllCarts />} />
        <Route path="/users" element={<AllUser />} />
        <Route path="/users/:userId/" element={<UserDetails />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/carts/:cartId/add-product" element={<AddProductToCart />} />
        <Route path="/carts/create" element={<CreateCart />} />
        {/* Pass setIsLoggedIn and setUsername as props to Login component */}
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/carts/:cartId" element={<CartDetail/>} />
      </Routes>
    </Router>
  );
}

export default App;
