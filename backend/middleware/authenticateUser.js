
const jwt = require('jsonwebtoken');
const pool = require('../config/database'); 

const authenticateUser = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const user = await pool.query('SELECT id, name FROM users WHERE id = $1', [decoded.userId]);

    if (!user.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = { userId: user.rows[0].id, name: user.rows[0].name }; 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateUser;
