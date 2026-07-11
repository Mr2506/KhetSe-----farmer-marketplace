const express = require('express');
const router = express.Router();
const { getDeliveryRoute, searchLocation } = require('../controllers/mapController');
const { protect } = require('../middleware/authMiddleware'); // Secure the route!

// @route   POST /api/map/route
router.post('/route', protect, getDeliveryRoute);
router.get('/search', protect, searchLocation);

module.exports = router;