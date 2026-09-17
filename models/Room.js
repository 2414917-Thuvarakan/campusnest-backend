const mongoose = require('mongoose');

// A "Room" listing - what a student posts when they have a room/PG to share
const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    rent: {
      type: Number,
      required: [true, 'Rent is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    sharingType: {
      type: String,
      enum: ['single', '2-sharing', '3-sharing', '4-sharing'],
      default: 'single',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    photos: {
      type: [String], // array of image URLs
      default: [],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // links this room to the user who posted it
      required: true,
    },
    contactNumber: {
      type: String,
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true, // set to false once the room is taken
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Room', roomSchema);
