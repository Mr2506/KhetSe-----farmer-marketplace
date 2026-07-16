const express = require('express');
const router = express.Router();
const { getAdminStats, getAllOrders, getAdminBuyers, getAdminFarmers, getAdminAnalytics } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getAdminStats);
router.get('/orders', protect, getAllOrders); 
router.get('/buyers', protect, getAdminBuyers);
router.get('/farmers', protect, getAdminFarmers);
router.get('/analytics', protect, getAdminAnalytics);

module.exports = router;