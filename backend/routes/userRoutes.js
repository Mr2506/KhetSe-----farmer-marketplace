// ... existing code ...
const express = require('express');
const router = express.Router();

const { registerUser, loginUser, checkPhone, getUserProfile, updateUserProfile, updateUserLocation } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Import our Bouncer!

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/check-phone', checkPhone); 

// GET profile data
router.get('/profile', protect, getUserProfile); 
// PUT (update) profile data
router.put('/profile', protect, updateUserProfile); 
router.put('/location', protect, updateUserLocation);

module.exports = router;