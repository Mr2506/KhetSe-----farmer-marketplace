const express = require('express');
const router = express.Router();
const { createOrder, getBuyerOrders, getFarmerSales } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware'); // The Bouncer!

// POST /api/orders -> Place a new order
router.post('/', protect, createOrder);

// GET /api/orders/myorders -> Buyer's purchase history
router.get('/myorders', protect, getBuyerOrders);

// GET /api/orders/sales -> Farmer's sales history
router.get('/sales', protect, getFarmerSales);

module.exports = router;