import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AllUser.css';

function AllUser() {
  const [users, setUsers] = useState([]);

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

  return (
    <div className="container">
      <h2>Users</h2>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <div className="user-info">
              <p className="user-name">
                <strong>Name:</strong> {user.username}
              </p>
              <Link className="view-details-btn" to={`/users/${user.id}`}>
                View Details
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllUser;
