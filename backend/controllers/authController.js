const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token (VIP Pass)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register New User (TEST MODE - NO FIREBASE)
// @route   POST /api/users/register
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, phone, role, farmVillageName, district, pincode, farmSize, cropsGrown } = req.body;

    // --- TEMPORARY BACKEND TEST MODE ---
    // We are NOT checking Firebase right now. We are just trusting the phone number you type.
    const verifiedPhone = phone; 
    // -----------------------------------

    // 1. Check if user exists
    const userExists = await User.findOne({ phone: verifiedPhone });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists. Please log in.' });
    }

    // 2. Create User in MongoDB
    const user = await User.create({
      firstName, lastName, phone: verifiedPhone, role, farmVillageName, district, pincode, farmSize, cropsGrown
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        firstName: user.firstName,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
        message: 'Account created successfully in MongoDB!'
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// @desc    Login Existing User (TEST MODE)
// @route   POST /api/users/login
const loginUser = async (req, res) => {
  try {
    const { phone } = req.body;

    // 1. Find User in MongoDB by phone directly
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'Account not found. Please sign up first.' });
    }

    // 2. Log in!
    res.status(200).json({
      _id: user.id,
      firstName: user.firstName,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
      message: 'Login successful!'
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

module.exports = { registerUser, loginUser };