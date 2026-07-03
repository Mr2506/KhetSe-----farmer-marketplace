const express = require('express');
const router = express.Router();

// 1. Import exactly what we exported from the controller
const { 
  createOrder, 
  createBulkOrders, 
  updateOrderStatus,
  getMyOrders, 
  getFarmerSales 
} = require('../controllers/orderController');

// 2. Import your security middleware
const { protect } = require('../middleware/authMiddleware');

// --- ROUTES ---

// @route   POST /api/orders
router.post('/', protect, createOrder);

// @route   POST /api/orders/bulk
// Used by the Cart to checkout multiple items at once
router.post('/bulk', protect, createBulkOrders);

// @route   GET /api/orders/myorders
// Used by the Buyer Dashboard
router.get('/myorders', protect, getMyOrders);

// @route   GET /api/orders/sales
// Used by the Farmer Dashboard
router.get('/sales', protect, getFarmerSales);

router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;