const mongoose = require('mongoose');

// An "Offer" - a discount or deal a shop/business is giving to students
const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    shopName: {
      type: String,
      required: [true, 'Shop name is required'],
      trim: true,
    },
    discount: {
      type: String, // kept as text since offers vary - "20% off", "Buy 1 Get 1", etc.
      required: [true, 'Discount detail is required'],
    },
    category: {
      type: String,
      enum: ['food', 'stationery', 'clothing', 'electronics', 'services', 'other'],
      default: 'other',
    },
    location: {
      type: String,
      trim: true,
    },
    validTill: {
      type: Date, // optional expiry date for the offer
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Offer', offerSchema);
