const Produce = require('../models/Produce');

// @desc    Get all available produce (For Buyers to see the market)
// @route   GET /api/produce
const getProduce = async (req, res) => {
  try {
    // Find all available produce. 
    // .populate() magically fetches the Farmer's Name and Village from the Users collection!
    const produce = await Produce.find({ isAvailable: true })
      .populate('farmer', 'firstName lastName farmVillageName district');
    
    res.status(200).json(produce);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch produce', error: error.message });
  }
};

// @desc    Add new produce (For Farmers to post items)
// @route   POST /api/produce
const addProduce = async (req, res) => {
  try {
    // req.user comes from our "protect" Bouncer middleware.
    // Let's make sure Buyers can't accidentally post crops!
    if (req.user.role !== 'Farmer') {
      return res.status(403).json({ message: 'Only registered Farmers can add produce.' });
    }

    const { name, category, quantityAvailable, unit, pricePerUnit, description } = req.body;

    // Create the crop in the database, automatically linked to the logged-in farmer
    const produce = await Produce.create({
      farmer: req.user.id, 
      name,
      category,
      quantityAvailable,
      unit,
      pricePerUnit,
      description
    });

    res.status(201).json(produce);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add produce', error: error.message });
  }
};

module.exports = { getProduce, addProduce };