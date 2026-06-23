const jwt = require('jsonwebtoken');
const User = require('../models/User');

// This function acts as a "Bouncer" for our secure routes
const protect = async (req, res, next) => {
  let token;

  // Check if the frontend sent a VIP pass (a Bearer token) in the headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token string
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret key from the .env file
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user attached to this token and attach their profile to the request
      // We use .select('-password') just in case we ever add passwords later, so it stays hidden
      req.user = await User.findById(decoded.id).select('-password');

      // The bouncer says you are good to go! Move to the next function.
      next(); 
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If there was no token attached at all
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no VIP token provided' });
  }
};

module.exports = { protect };