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

// @desc    Get all orders for the Admin Dashboard
// @route   GET /api/admin/orders
const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Access Denied.' });

    // 1. ADDED POPULATE: We must ask MongoDB for the produceItem's details!
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('buyer', 'firstName lastName')
      .populate('farmer', 'firstName lastName')
      .populate('produceItem', 'name'); // 👈 This grabs the crop name!

    // 2. Format them for the UI
    const formattedOrders = orders.map(o => {
      
      // Extract the single item name safely
      const cropName = o.produceItem && o.produceItem.name ? o.produceItem.name : 'Unknown Crop';

      return {
        id: o._id,
        buyerName: o.buyer ? `${o.buyer.firstName} ${o.buyer.lastName}` : 'Unknown Buyer',
        farmerName: o.farmer ? `${o.farmer.firstName} ${o.farmer.lastName}` : 'Unknown Farmer',
        grandTotal: o.totalPrice,
        placedAt: o.createdAt,
        status: o.status || 'Pending',
        // The frontend wants a list, so we wrap your single crop in an array:
        items: [cropName], 
        dispute: false 
      };
    });

    res.status(200).json(formattedOrders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

// @desc    Get all buyers with their order stats
// @route   GET /api/admin/buyers
const getAdminBuyers = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Access Denied.' });

    // 1. Fetch all users who are buyers
    const buyers = await User.find({ role: 'Buyer' }).select('-password');

    // 2. Fetch all orders so we can calculate their spend history
    const orders = await Order.find().select('buyer grandTotal _id createdAt');

    // 3. Mash them together into a clean payload for the frontend
    const formattedBuyers = buyers.map(buyer => {
      // Find all orders belonging to this specific buyer
      const buyerOrders = orders.filter(o => o.buyer.toString() === buyer._id.toString());
      
      // Calculate total spent
      const totalSpent = buyerOrders.reduce((sum, order) => sum + order.grandTotal, 0);

      // Sort by date to get the most recent order ID
      buyerOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const lastOrder = buyerOrders.length > 0 
        ? buyerOrders[0]._id.toString().slice(-8).toUpperCase() 
        : "—";

      return {
        id: buyer._id,
        name: `${buyer.firstName} ${buyer.lastName}`,
        phone: buyer.phone,
        buyerType: buyer.buyerType || "Household", 
        totalSpent: totalSpent,
        orderCount: buyerOrders.length,
        lastOrderNumber: lastOrder
      };
    });

    res.status(200).json(formattedBuyers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch buyers', error: error.message });
  }
};

// @desc    Get all farmers with their sales and ratings
// @route   GET /api/admin/farmers
const getAdminFarmers = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Access Denied.' });

    // 1. Fetch all Farmers, Orders, and Produce
    const farmers = await User.find({ role: 'Farmer' }).select('-password');
    const orders = await Order.find().select('farmer grandTotal status');
    const produce = await Produce.find().select('farmer rating numReviews isAvailable cropsGrown');

    // 2. Mash them together to calculate the stats
    const formattedFarmers = farmers.map(farmer => {
      const fId = farmer._id.toString();
      
      // Order Stats
      const farmerOrders = orders.filter(o => o.farmer?.toString() === fId);
      const revenue = farmerOrders.reduce((sum, order) => sum + order.grandTotal, 0);
      const sold = farmerOrders.filter(o => o.status === 'Delivered').length;

      // Produce & Rating Stats
      const farmerProduce = produce.filter(p => p.farmer?.toString() === fId);
      
      let totalRatingPoints = 0;
      let totalReviewCount = 0;
      
      farmerProduce.forEach(crop => {
        if (crop.numReviews > 0) {
          totalRatingPoints += (crop.rating * crop.numReviews);
          totalReviewCount += crop.numReviews;
        }
      });

      const avgRating = totalReviewCount > 0 ? (totalRatingPoints / totalReviewCount).toFixed(1) : 0;

      return {
        id: farmer._id,
        name: `${farmer.firstName} ${farmer.lastName}`,
        village: farmer.farmVillageName || "Unknown Village",
        farmSize: farmer.farmSize || "",
        cropsGrown: farmer.cropsGrown || [],
        revenue: revenue,
        sold: sold,
        listings: farmerProduce.length,
        rating: avgRating,
        reviewCount: totalReviewCount
      };
    });

    res.status(200).json(formattedFarmers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch farmers', error: error.message });
  }
};

// @desc    Get data for Admin Analytics Charts
// @route   GET /api/admin/analytics
const getAdminAnalytics = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Access Denied.' });

    // 1. Fetch everything we need
    const users = await User.find().select('role createdAt');
    const orders = await Order.find()
      .populate('farmer', 'farmVillageName')
      .populate('produceItem', 'name');

    // 2. CALCULATE CROP DATA (Top 5 Most Traded)
    const cropMap = {};
    orders.forEach(o => {
      const cropName = o.produceItem && o.produceItem.name ? o.produceItem.name : 'Unknown';
      const volume = o.quantityOrdered || 1; // Fallback to 1 if quantity is missing
      cropMap[cropName] = (cropMap[cropName] || 0) + volume;
    });
    const cropData = Object.keys(cropMap)
      .map(key => ({ crop: key, volume: cropMap[key] }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5); // Take top 5

    // 3. CALCULATE REGION DATA (Revenue by Farmer Village)
    const regionMap = {};
    orders.forEach(o => {
      const region = o.farmer && o.farmer.farmVillageName ? o.farmer.farmVillageName : 'Other';
      regionMap[region] = (regionMap[region] || 0) + o.totalPrice;
    });
    const regionData = Object.keys(regionMap)
      .map(key => ({ region: key, revenue: regionMap[key] }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4); // Take top 4

    // 4. CALCULATE GROWTH DATA (Last 6 Months)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const growthMap = {};
    
    // Pre-fill the last 6 months so the chart doesn't look empty
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mName = monthNames[d.getMonth()];
      growthMap[mName] = { month: mName, buyers: 0, farmers: 0, monthIndex: d.getMonth() };
    }

    // Tally up the users based on when they joined
    users.forEach(u => {
      const d = new Date(u.createdAt);
      const mName = monthNames[d.getMonth()];
      // Only count them if they joined in our 6 month window
      if (growthMap[mName]) {
        if (u.role === 'Buyer') growthMap[mName].buyers += 1;
        if (u.role === 'Farmer') growthMap[mName].farmers += 1;
      }
    });
    
    // Convert to array and sort chronologically
    const growthData = Object.values(growthMap).sort((a, b) => a.monthIndex - b.monthIndex);

    // Send it all to the frontend!
    res.status(200).json({ cropData, regionData, growthData });

  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};


module.exports = { getAdminStats, getAllOrders, getAdminBuyers, getAdminFarmers, getAdminAnalytics };