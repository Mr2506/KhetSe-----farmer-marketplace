const express = require('express');
const router = express.Router();
const { getProduce, addProduce } = require('../controllers/produceController');
const { protect } = require('../middleware/authMiddleware');

// GET request to /api/produce -> Anyone can view the crops
router.get('/', getProduce);

// POST request to /api/produce -> MUST go through the Bouncer (protect) first!
router.post('/', protect, addProduce);

module.exports = router;