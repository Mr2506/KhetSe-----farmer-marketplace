const Order = require('../models/Order');
const Produce = require('../models/Produce');

// @desc    Create a new order (Buyer buying crops)
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    if (req.user.role !== 'Buyer') {
      return res.status(403).json({ message: 'Only registered Buyers can place orders.' });
    }

    const { produceId, quantityOrdered } = req.body;
    const produceItem = await Produce.findById(produceId);

    if (!produceItem) {
      return res.status(404).json({ message: 'Produce not found.' });
    }

    if (produceItem.quantityAvailable < quantityOrdered) {
      return res.status(400).json({ 
        message: `Not enough stock. Only ${produceItem.quantityAvailable} ${produceItem.unit} available.` 
      });
    }

    const totalPrice = quantityOrdered * produceItem.pricePerUnit;

    const order = await Order.create({
      buyer: req.user._id,
      farmer: produceItem.farmer,
      produceItem: produceItem._id,
      quantityOrdered,
      totalPrice,
      status: 'Pending'
    });

    produceItem.quantityAvailable -= quantityOrdered;
    if (produceItem.quantityAvailable === 0) {
      produceItem.isAvailable = false;
    }
    await produceItem.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
};

// @desc    Create MULTIPLE orders at once from the Cart
// @route   POST /api/orders/bulk
const createBulkOrders = async (req, res) => {
  try {
    if (req.user.role !== 'Buyer') {
      return res.status(403).json({ message: 'Only registered Buyers can place orders.' });
    }

    const { items } = req.body; 
    const createdOrders = [];

    for (let item of items) {
      const produceItem = await Produce.findById(item.produceId);

      if (!produceItem || produceItem.quantityAvailable < item.quantityOrdered) {
        throw new Error(`Not enough stock for ${produceItem ? produceItem.name : 'an item in your cart'}.`);
      }

      const totalPrice = item.quantityOrdered * produceItem.pricePerUnit;

      const order = await Order.create({
        buyer: req.user._id,
        farmer: produceItem.farmer,
        produceItem: produceItem._id,
        quantityOrdered: item.quantityOrdered,
        totalPrice,
        status: 'Pending'
      });

      produceItem.quantityAvailable -= item.quantityOrdered;
      if (produceItem.quantityAvailable === 0) {
        produceItem.isAvailable = false;
      }
      await produceItem.save();

      createdOrders.push(order);
    }

    res.status(201).json(createdOrders);
  } catch (error) {
    res.status(400).json({ message: 'Bulk order failed', error: error.message });
  }
};

// @desc    Get logged in buyer's orders (For Buyer Dashboard)
// @route   GET /api/orders/myorders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate('produceItem', 'name category unit price photos') 
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
    const orders = await Order.find({ farmer: req.user._id })
      .populate('produceItem', 'name')
      .populate('buyer', 'firstName lastName phone cityArea'); 
      
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sales', error: error.message });
  }
};

// @desc    Update order status (Farmer accepting/delivering)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure the person updating it is the farmer who owns the order
    if (order.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};

module.exports = { createOrder, createBulkOrders, updateOrderStatus, getMyOrders, getFarmerSales  };