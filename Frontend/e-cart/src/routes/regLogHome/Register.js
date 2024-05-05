// Register.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';



function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const sleep = ms => new Promise(r => setTimeout(r, ms));


  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3001/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      // Registration successful, you can redirect the user to another page
      // or display a success message
      console.log('User registered successfully');
      alert("User registered successfully");

    } catch (error) {
      console.error('Error registering user:', error.message);
    }
  };

  const handleClick =  async () => {
    // Navigate back to the home page
    await sleep(1000);
    navigate('/');
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <p></p>

        <button type="submit" onClick={handleClick}>Register</button>
      </form>
    </div>
  );
}

export default Register;
