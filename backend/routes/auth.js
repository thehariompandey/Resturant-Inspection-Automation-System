const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Simple in-memory user store (for prototype)
const users = [
  {
    email: 'admin@heyopey.com',
    password: '$2a$10$YourHashedPasswordHere', // admin123
    name: 'Admin User'
  }
];

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // For prototype: simple check
    if (email === 'admin@heyopey.com' && password === 'admin123') {
      const token = jwt.sign(
        { email, name: 'Admin User' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        token,
        user: { email, name: 'Admin User' }
      });
    }

    res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register (for prototype)
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const token = jwt.sign(
      { email, name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { email, name }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;