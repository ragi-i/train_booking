import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './UserRegister.css';

const UserRegister = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/user/signup', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('Success:', response.data);
        navigate('/login');
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
        <h3>Plan. Book. Travel. Seamlessly.</h3>
          <h1>Create Account</h1>
          
          <input
            type="text"
            name="username"
            placeholder="Full Name"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <div className="login-link">
          <p>Already a User? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-right">
            <h1>From Dreams to Destinations,</h1>
            <p>We’ve Got Your Seat Covered!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
