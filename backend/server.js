const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "https://khetse-farmer-marketplace-six.vercel.app"
  ],
  credentials: true, // This is crucial for authentication tokens/OTP to work!
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
app.use(express.json());

// Basic Test Route
app.get('/', (req, res) => {
  res.send('Marketplace API is running...');
});

// All Routes grouped cleanly together
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/produce', require('./routes/produceRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/map', require('./routes/mapRoutes')); // The correct one!

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB Connected Successfully'))
  .catch((err) => console.log(' MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});