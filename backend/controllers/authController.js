// ... existing code ...
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Modern Firebase Admin Setup
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

// 👑 ADMIN HARDCODE: Put your real phone numbers here (always start with +91)
const ADMIN_NUMBERS = ['+919327741541', '+917041971026'];

// Generate JWT Token (VIP Pass)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register New User (REAL FIREBASE)
// @route   POST /api/users/register
const registerUser = async (req, res) => {
  try {
    const { firebaseToken, firstName, lastName, role, farmVillageName, district, pincode, farmSize, cropsGrown, cityArea, buyingFor } = req.body;

    if (!firebaseToken) return res.status(400).json({ message: 'Firebase token is required' });

    // 1. Verify token using Google's secure servers
    const decodedToken = await getAuth().verifyIdToken(firebaseToken);
    const phone = decodedToken.phone_number;

    // 2. Check if user exists
    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists. Please log in.' });
    }

    // 👑 MAGIC ADMIN UPGRADE: Check if the number is on our VIP list!
    let assignedRole = role;
    if (ADMIN_NUMBERS.includes(phone)) {
      assignedRole = 'Admin';
      console.log(`👑 Admin Account Created for: ${phone}`);
    }

    // 3. Create User in MongoDB
    const user = await User.create({
      firstName, lastName, phone, role: assignedRole, farmVillageName, district, pincode, farmSize, cropsGrown, cityArea, buyingFor
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

// @desc    Login Existing User (REAL FIREBASE)
// @route   POST /api/users/login
const loginUser = async (req, res) => {
  try {
    const { firebaseToken } = req.body;

    if (!firebaseToken) return res.status(400).json({ message: 'Firebase token is required' });

    // 1. Verify token
    const decodedToken = await getAuth().verifyIdToken(firebaseToken);
    const phone = decodedToken.phone_number;

    // 2. Find User in MongoDB
    let user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'Account not found. Please sign up first.' });
    }

    // 👑 AUTO-UPGRADE ADMINS: If you signed up as a buyer previously, but your number is here, upgrade it!
    if (ADMIN_NUMBERS.includes(user.phone) && user.role !== 'Admin') {
      user.role = 'Admin';
      await user.save();
      console.log(`👑 Upgraded existing user to Admin: ${user.phone}`);
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