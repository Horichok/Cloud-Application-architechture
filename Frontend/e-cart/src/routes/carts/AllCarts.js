import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './AllCarts.css'; // Import the CSS file

function AllCarts() {
  const [carts, setCarts] = useState([]);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch carts data from backend when the component mounts
    fetchCarts();
  }, []); // Empty dependency array ensures the effect runs only once

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchCarts = async () => {
    try {
      const response = await fetch('http://localhost:3001/carts/all');
      const data = await response.json();
      setCarts(data);
    } catch (error) {
      console.error('Error fetching carts:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/all');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const getUsernameFromId = (userId) => {
    if (!Array.isArray(users) || users.length === 0) {
      return 'Loading...'; // Or any other indication that users are being fetched
    }
    const user = users.find((user) => user.id === userId);
    return user ? user.username : 'Unknown User';
  };

  const handleClick = () => {
    // Navigate back to the home page
    navigate('/carts/create');
  };

  return (
    <div className="container">
      <h2>Carts</h2>
      <button className="create-button" onClick={handleClick}>
        Create new E-Cart
      </button>
      <ul className="cart-list">
        {carts.map((cart) => (
          <li key={cart.id} className="cart-item">
            <p>
              <span className="cart-name">
                <strong>Name:</strong> {cart.name}
              </span>
              <span className="cart-owner">
                , <strong>Owner:</strong> {getUsernameFromId(cart.userId)}
              </span>
              <Link to={`/carts/${cart.id}`} className="detail-link">
                Detail
              </Link>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllCarts;
