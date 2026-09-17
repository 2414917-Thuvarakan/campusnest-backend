const jwt = require('jsonwebtoken');
const User = require('../models/User');

// This middleware protects routes that require login.
// It expects the frontend to send: Authorization: Bearer <token>
async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    const token = authHeader.split(' ')[1]; // "Bearer <token>" -> just the token part

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the logged-in user (minus password) to the request,
    // so any route using this middleware can access req.user
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    next(); // token is valid - let the request continue
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, invalid or expired token' });
  }
}

module.exports = protect;