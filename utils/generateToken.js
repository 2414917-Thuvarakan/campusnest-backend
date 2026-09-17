const jwt = require('jsonwebtoken');

// Creates a signed token containing the user's id.
// The frontend stores this token and sends it back on future
// requests to prove "I'm logged in as this user".
function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // token stays valid for 30 days
  });
}

module.exports = generateToken;