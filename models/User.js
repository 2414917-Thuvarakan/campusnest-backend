const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
      // automatically below, right before saving
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

// This runs automatically right before a user document is saved.
// If the password field was changed (or this is a new user), we hash it.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); // password unchanged - skip re-hashing
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Helper method to check a login attempt's password against the stored hash.
// Usage: const isMatch = await user.comparePassword('typedPassword');
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);