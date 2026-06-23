const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Modern Firebase Admin Setup (v12+)
const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

try {
  const serviceAccount = require('../firebaseServiceAccountKey.json');
  initializeApp({
    credential: cert(serviceAccount)
  });
  console.log('✅ Firebase Admin Initialized');
} catch (error) {
  console.error('🔥 ACTUAL FIREBASE ERROR:', error.message);
  console.warn('⚠️ Firebase Admin not initialized yet.');
}

// Generate JWT Token (VIP Pass)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register New User (After Firebase OTP)
// @route   POST /api/users/register
const registerUser = async (req, res) => {
  try {
    const { firebaseToken, firstName, lastName, role, location, pincode, farmSize, cropsGrown, buyingFor } = req.body;

    if (!firebaseToken) return res.status(400).json({ message: 'Firebase token is required' });

    // 1. Verify token using modern getAuth()
    const decodedToken = await getAuth().verifyIdToken(firebaseToken);
    const phone = decodedToken.phone_number;

    // 2. Check if user exists
    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists. Please log in.' });
    }

    // 3. Create User in MongoDB
    const user = await User.create({
      firstName, lastName, phone, role, location, pincode, farmSize, cropsGrown, buyingFor
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        firstName: user.firstName,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
        message: 'Account created successfully!'
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// @desc    Login Existing User (After Firebase OTP)
// @route   POST /api/users/login
const loginUser = async (req, res) => {
  try {
    const { firebaseToken } = req.body;

    if (!firebaseToken) return res.status(400).json({ message: 'Firebase token is required' });

    // 1. Verify token
    const decodedToken = await getAuth().verifyIdToken(firebaseToken);
    const phone = decodedToken.phone_number;

    // 2. Find User in MongoDB
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'Account not found. Please sign up first.' });
    }

    // 3. Log in!
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