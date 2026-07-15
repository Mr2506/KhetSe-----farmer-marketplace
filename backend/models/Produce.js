const mongoose = require('mongoose');

const produceSchema = mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add a crop name'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
    },
    quantityAvailable: {
      type: Number,
      required: [true, 'Please add the available quantity'],
    },
    unit: {
      type: String,
      default: 'kg',
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Please add your price'],
    },
    
    mandiPrice: {
      type: Number,
    },
    harvestDate: {
      type: Date,
    },
    isOrganic: {
      type: Boolean,
      default: false,
    },
    fulfillment: {
      type: String,
      default: 'Pickup & Delivery',
    },
    photos: [{
      type: String, // This will store the emojis as an array of strings (e.g., ["🍅", "🥬"])
    }],
    description: {
      type: String,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Produce', produceSchema);