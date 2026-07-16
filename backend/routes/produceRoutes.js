const express = require('express');
const router = express.Router();

// THE FIX IS HERE: We added 'getProduceById' to the end of this list!
const { getProduce, getFarmerProduce, addProduce, updateProduce, deleteProduce, getProduceById, createProduceReview } = require('../controllers/produceController');
const { protect } = require('../middleware/authMiddleware');

// Public route for Buyers to see all crops
router.get('/', getProduce);

// Protected route for Farmers to see their own listings
router.get('/mylistings', protect, getFarmerProduce);

// Add this line so the frontend can find the crops!
router.get('/farmer/my-produce', protect, getFarmerProduce);

// Protected route to post a new listing
router.post('/', protect, addProduce);

// Protected routes to Update (Edit Price/Qty/Pause) and Delete individual items
router.put('/:id', protect, updateProduce);
router.delete('/:id', protect, deleteProduce);

// Public route to get a single crop by ID (Must be at the bottom!)
router.get('/:id', getProduceById);

// Add the review route
router.post('/:id/reviews', protect, createProduceReview);

module.exports = router;