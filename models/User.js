const mongoose = require('mongoose');

// This defines what a "User" looks like in our database.
// Every student who signs up gets a document shaped like this.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // no two users can have the same email
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      // we NEVER store the plain password - this gets hashed
      // before saving (we'll wire that up in the auth step)
    },
    college: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('User', userSchema);
