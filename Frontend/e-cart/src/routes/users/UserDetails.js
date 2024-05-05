import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './UserDetails.css';

function UserDetails() {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [carts, setCarts] = useState([]);

  useEffect(() => {
    fetchUserAndCarts();
  }, []);

  const fetchUserAndCarts = async () => {
    try {
      // Fetch user details
      const userResponse = await fetch(`http://localhost:3001/users/${userId}`);
      const userData = await userResponse.json();
      
      if (!userData) {
        throw new Error('User not found');
      }
      
      setUser(userData);

      // Fetch user's carts
      const cartsResponse = await fetch(`http://localhost:3001/users/${userId}/allcarts`);
      const userCarts = await cartsResponse.json();

      setCarts(userCarts);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const isCollaborator = (cart) => {
    return cart && cart.userId !== null && cart.userId !== parseInt(userId) && cart.collaborators && cart.collaborators.includes(parseInt(userId));
  };
  

  return (
    <div className="container">
      <h2>User Details</h2>
      <div className="user-details">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>User ID:</strong> {user.id}</p>
        <div className="cart-list">
          <p>User's Carts:</p>
          {carts.length === 0 ? (
            <p>No carts found for this user.</p>
          ) : (
            carts.map((cart) => (
              <div key={cart.id} className={`cart-block ${isCollaborator(cart) ? 'cart-collaborate' : ''}`}>
                <Link to={`/carts/${cart.id}`}>
                  <button className="cart-button">
                    <div>{cart.name}</div>
                    <div>ID: {cart.id}</div>
                  </button>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
