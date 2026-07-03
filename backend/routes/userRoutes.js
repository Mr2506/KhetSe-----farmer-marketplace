// ... existing code ...
const express = require('express');
const router = express.Router();

// WE ADDED updateUserProfile TO THIS LIST!
const { registerUser, loginUser, checkPhone, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Import our Bouncer!

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/check-phone', checkPhone); 

// GET profile data
router.get('/profile', protect, getUserProfile); 
// PUT (update) profile data
router.put('/profile', protect, updateUserProfile); 

module.exports = router;