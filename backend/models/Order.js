const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Links to the Buyer's profile
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Links to the Farmer's profile
    },
    produceItem: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Produce', // Links to the specific crop they bought (e.g., Tomatoes)
    },
    quantityOrdered: {
      type: Number,
      required: [true, 'Please specify how much you want to buy'],
    },
    totalPrice: {
      type: Number,
      required: true, // We will calculate this in the controller: quantity * pricePerUnit
    },
     status: {
      type: String,
      required: true,
      enum: ['Confirmed', 'Completed', 'Cancelled'], // <--- Make sure 'Confirmed' is in this list!
      default: 'Confirmed',
    }
  },
  {
    timestamps: true, // Tracks exactly when the order was placed
  }
);

module.exports = mongoose.model('Order', orderSchema);