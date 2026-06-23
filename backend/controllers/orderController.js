const Order = require('../models/Order');
const Produce = require('../models/Produce');

// @desc    Create a new order (Buyer buying crops)
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    // 1. Make sure only Buyers can place orders
    if (req.user.role !== 'Buyer') {
      return res.status(403).json({ message: 'Only registered Buyers can place orders.' });
    }

    const { produceId, quantityOrdered } = req.body;

    // 2. Find the exact crop they want to buy
    const produceItem = await Produce.findById(produceId);

    if (!produceItem) {
      return res.status(404).json({ message: 'Produce not found.' });
    }

    // 3. Check if the farmer has enough stock!
    if (produceItem.quantityAvailable < quantityOrdered) {
      return res.status(400).json({ 
        message: `Not enough stock. Only ${produceItem.quantityAvailable} ${produceItem.unit} available.` 
      });
    }

    // 4. Calculate the total price automatically
    const totalPrice = quantityOrdered * produceItem.pricePerUnit;

    // 5. Create the Order receipt
    const order = await Order.create({
      buyer: req.user._id,
      farmer: produceItem.farmer, // Automatically links to the farmer who posted it!
      produceItem: produceItem._id,
      quantityOrdered,
      totalPrice,
      status: 'Confirmed' // Instantly confirmed based on our new logic!
    });

    // 6. DEDUCT THE STOCK from the Farmer's inventory
    produceItem.quantityAvailable -= quantityOrdered;
    
    // If they bought the last of it, take it off the market!
    if (produceItem.quantityAvailable === 0) {
      produceItem.isAvailable = false;
    }
    await produceItem.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
};

// @desc    Get all orders for the logged-in Buyer (For Buyer Dashboard)
// @route   GET /api/orders/myorders
const getBuyerOrders = async (req, res) => {
  try {
    // Find orders where the buyer matches the logged-in user
    // .populate() pulls in the crop details and the farmer's contact info!
    const orders = await Order.find({ buyer: req.user._id })
      .populate('produceItem', 'name category unit')
      .populate('farmer', 'firstName lastName phone farmVillageName');
      
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

// @desc    Get all orders for the logged-in Farmer (For Farmer Dashboard)
// @route   GET /api/orders/sales
const getFarmerSales = async (req, res) => {
  try {
    // Find orders where the farmer matches the logged-in user
    const orders = await Order.find({ farmer: req.user._id })
      .populate('produceItem', 'name')
      .populate('buyer', 'firstName lastName phone cityArea'); // Gives farmer the delivery info!
      
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sales', error: error.message });
  }
};

module.exports = { createOrder, getBuyerOrders, getFarmerSales };