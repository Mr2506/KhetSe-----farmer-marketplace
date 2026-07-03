const User = require('../models/User');
const Order = require('../models/Order');
const Produce = require('../models/Produce');

// @desc    Get overall platform statistics for Admin Dashboard
// @route   GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Access Denied. Admins only.' });

    const totalFarmers = await User.countDocuments({ role: 'Farmer' });
    const totalBuyers = await User.countDocuments({ role: 'Buyer' });
    const totalOrders = await Order.countDocuments();
    const totalActiveProduce = await Produce.countDocuments({ isAvailable: true });

    // Meet's UI expects specific keys: buyers, farmers, orders, listings
    res.status(200).json({
      buyers: totalBuyers,
      farmers: totalFarmers,
      orders: totalOrders,
      listings: totalActiveProduce
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load admin stats', error: error.message });
  }
};

// @desc    Get all recent orders for the Admin Dashboard
// @route   GET /api/admin/orders
const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Access Denied.' });

    // Fetch the 10 most recent orders and populate names
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('buyer', 'firstName lastName')
      .populate('farmer', 'firstName lastName');

    // Format them exactly how Meet's UI expects them
    const formattedOrders = orders.map(o => ({
      id: o._id,
      buyerName: o.buyer ? `${o.buyer.firstName} ${o.buyer.lastName}` : 'Unknown Buyer',
      farmerName: o.farmer ? `${o.farmer.firstName} ${o.farmer.lastName}` : 'Unknown Farmer',
      grandTotal: o.totalPrice,
      placedAt: o.createdAt
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

module.exports = { getAdminStats, getAllOrders };