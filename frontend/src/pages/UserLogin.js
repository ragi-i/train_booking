import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';


const UserLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/user/login', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('Success:', response.data);

       
        localStorage.setItem('token', response.data.token);
        console.log('token', response.data.token)
        navigate('/seats');
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
          <h3>Welcome Back!</h3>
          <h1>Sign In</h1>

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
          <button type="submit">Login</button>
        </form>
        <div className="register-link">
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-right">
            <h1>Start Your Journey</h1>
            <p>Log in to continue booking your dream destinations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
