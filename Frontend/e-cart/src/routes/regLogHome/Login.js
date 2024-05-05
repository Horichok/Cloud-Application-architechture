// Login.js
import React, { useState } from 'react';
//import styles from './Login.module.css'; // Import CSS module

const logged = false ;

function handleClickLogged() {
  if (logged)
    alert('Yes!');
  else
    alert('No!');
}

function handleClickNo() {
  alert('You clicked me!');
}

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      // Login successful, update the isLoggedIn state
      setIsLoggedIn(true);
      logged = true;
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

 

  return (
    <div>
      <h2>Login</h2>
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
        <button onClick={handleClickLogged} type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
