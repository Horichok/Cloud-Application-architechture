import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateCart.css'; // Import the CSS file


function CreateCart() {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState(0); // Initialize userId as an integer
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/all');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Wait for users data to be fetched before finding the matching user ID
    await fetchUsers();

    // Find the matching user ID based on the entered username
    const foundUser = users.find((user) => user.username === username);
    if (!foundUser) {
      console.error('User not found');
      alert("User not found");
      return;
    }

    // Set the user ID in the state
    setUserId(foundUser.id);

    try {
      // Send a POST request to the backend to create the cart
      const response = await fetch('http://localhost:3001/carts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, userId: foundUser.id }), // Use found user ID
      });

      if (response.ok) {
        // Cart created successfully, navigate back to the home page
        navigate('/carts/');
        alert("Cart created succesfully");
      } else {
        const data = await response.json();
        console.error('Error creating cart:', data.message);
      }
    } catch (error) {
      console.error('Error creating cart:', error);
    }
  };

  return (
    <div>
      <h2>Create Cart</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="User">Owner Name:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Cart</button>
      </form>
    </div>
  );
}

export default CreateCart;
