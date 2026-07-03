const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Test Route
app.get('/', (req, res) => {
  res.send('Marketplace API is running...');
});

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/produce', require('./routes/produceRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB Connected Successfully'))
  .catch((err) => console.log(' MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});