const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// POST /api/auth/signup
// Creates a new student account
async function signup(req, res) {
  try {
    const { name, email, password, college } = req.body;

    // Basic validation - make sure the required fields were sent
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Check if someone already signed up with this email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Create the user - the password gets hashed automatically
    // by the pre('save') hook we added in models/User.js
    const user = await User.create({ name, email, password, college });

    // Log them in immediately by sending back a token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong during signup', error: error.message });
  }
}

// POST /api/auth/login
// Logs an existing student in
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find the user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't say "email not found" specifically - it's safer to
      // keep the error generic so people can't guess valid emails
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check the password against the stored hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong during login', error: error.message });
  }
}

module.exports = { signup, login };