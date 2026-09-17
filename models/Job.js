const mongoose = require('mongoose');

// A "Job" posting - part-time work, tutoring, internships, campus gigs
const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    payRate: {
      type: String, // text since pay can be "₹300/hr", "₹8000/month", etc.
      required: [true, 'Pay rate is required'],
    },
    jobType: {
      type: String,
      enum: ['part-time', 'internship', 'freelance', 'one-time'],
      default: 'part-time',
    },
    location: {
      type: String,
      trim: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contactInfo: {
      type: String,
      trim: true,
    },
    isOpen: {
      type: Boolean,
      default: true, // set to false once the position is filled
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);
