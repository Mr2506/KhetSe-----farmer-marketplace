const mongoose = require('mongoose');

const produceSchema = mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This magically links the crop to the specific farmer's profile in the database
    },
    name: {
      type: String,
      required: [true, 'Please add a crop name (e.g., Tomatoes, Wheat)'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Vegetables', 'Fruits', 'Grains', 'Spices', 'Other'],
    },
    quantityAvailable: {
      type: Number,
      required: [true, 'Please add the available quantity'],
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'tonnes', 'grams', 'liters'],
      default: 'kg',
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Please add a price per unit in Rupees'],
    },
    description: {
      type: String,
      required: false, // Optional details about quality, organic status, etc.
    },
    isAvailable: {
      type: Boolean,
      default: true, // Automatically set to true when they post it
    },
     // Add this right below the description field inside models/Produce.js
    image: {
      type: String,
      required: false, // Optional, so the tomatoes you already posted don't cause errors!
    }
  },
  {
    timestamps: true, // Automatically tracks when the crop was posted
  }
 
);

module.exports = mongoose.model('Produce', produceSchema);