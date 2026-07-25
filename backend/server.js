const express = require('express');
const http = require('http');           
const { Server } = require('socket.io');
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

// 1. WRAP EXPRESS WITH HTTP AND INITIALIZE SOCKET.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000", 
      "https://khetse-farmer-marketplace-six.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "OPTIONS"]
  }
});
app.set('io', io);

//  2. LISTEN FOR REAL-TIME CONNECTIONS
io.on('connection', (socket) => {
  console.log(`A user connected to WebSockets: ${socket.id}`);

  // When a user closes the browser/app
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

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
app.use('/api/map', require('./routes/mapRoutes')); 

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.log(' MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;

// 3. CHANGE FROM APP.LISTEN TO SERVER.LISTEN
server.listen(PORT, () => {
  console.log(`Server & WebSockets running on port ${PORT}`);
});