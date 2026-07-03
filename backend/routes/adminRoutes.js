const express = require('express');
const router = express.Router();
const { getAdminStats, getAllOrders } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getAdminStats);
router.get('/orders', protect, getAllOrders); 

module.exports = router;