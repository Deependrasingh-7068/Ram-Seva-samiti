const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Slows down brute-force login/signup attempts without blocking normal use.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again later.' },
});

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

function isValidEmail(email) {
  return typeof email === 'string' && /^\S+@\S+\.\S+$/.test(email);
}

// POST /api/auth/register
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // 1. Trim invisible spaces and convert to lowercase to prevent matching bugs
    const cleanEmail = email.trim().toLowerCase();

    if (!isValidEmail(cleanEmail) || !password || password.length < 6) {
      return res.status(400).json({
        message: 'A valid email and a password of at least 6 characters are required.',
      });
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // 2. Include 'phone' in the database creation
    const user = await User.create({
      name: name?.trim(),
      email: cleanEmail,
      phone: phone?.trim(), 
      password: hashedPassword,
      role: 'user',
      designation: 'Member',          // Hardcoded force override
      designationHindi: 'सदस्य',      // Hardcoded force override
    });

    res.status(201).json({
      message: 'Account created successfully',
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Registration Crash:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trim invisible spaces and convert to lowercase for exact database matching
    const cleanEmail = email.trim().toLowerCase();

    if (!isValidEmail(cleanEmail) || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: cleanEmail });
    const passwordMatches = user && (await bcrypt.compare(password, user.password));

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.status(200).json({
      message: 'Login successful',
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login Crash:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  res.status(200).json({ name: req.user.name, email: req.user.email });
});

module.exports = router;