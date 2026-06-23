const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please add a first name'],
    },
    lastName: {
      type: String,
      required: [true, 'Please add a last name'],
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
      unique: true, // Phone number acts as their unique ID now
    },
    role: {
      type: String,
      required: [true, 'Please select a role'],
      enum: ['Buyer', 'Farmer', 'Admin'], // <-- ADDED 'Admin' HERE!
    },
    cityArea: {
      type: String,
      required: false, // Optional, only for buyers
    },
    buyingFor: {
      type: String,
      required: false, // Optional, only for buyers
    },
    farmVillageName: {
      type: String,
      required: false, // Optional, only for farmers
    },
    district: {
      type: String,
      required: false, // Optional, only for farmers
    },
    pincode: {
      type: String,
      required: false, // Optional, only for farmers
    },
    farmSize: {
      type: String,
      required: false, // Optional, only for farmers
    },
    cropsGrown: {
      type: [String], // Array of strings (e.g., ['Vegetables', 'Fruits'])
      required: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);