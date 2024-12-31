const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const sequelize = require("./config/database");
const userRoutes= require('./routes/userRoute');
const seatRoutes = require('./routes/seatBookingRoute');
const pool = require('./config/database');

const app = express();


app.use(cors());
app.use(bodyParser.json());

// const SECRET_KEY = "secret_key";

const authenticateUser = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token with your secret
    const user = await pool.query('SELECT id, name FROM users WHERE id = $1', [decoded.userId]); // Query for user info

    if (!user.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = { userId: user.rows[0].id, name: user.rows[0].name }; // Attach user data to req
    next(); // Proceed to next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

app.use('/user',userRoutes);
app.use('/api', seatRoutes);

pool
  .query('SELECT NOW()')  // Query to test the connection (this just gets the current time)
  .then((res) => {
    console.log('Connected to the database:', res.rows[0]);
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
