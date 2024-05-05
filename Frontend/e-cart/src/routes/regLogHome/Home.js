import React from 'react';
import { useLocation } from 'react-router-dom';
import './Home.css'; // Import CSS file for styling

function Home() {
  const location = useLocation();
  const username = location.state?.username || ''; 

  return (
    <div className="home-container">
      <div className="welcome">
        <h2>Welcome to e-cart</h2>
        <p>At e-cart, we're on a mission to simplify grocery shopping for everyone.</p>
        <p>Our app helps families and individuals manage their grocery lists, collaborate with others, and make informed shopping decisions.</p>
      </div>
    </div>
  );
}

export default Home;
