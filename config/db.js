const mongoose = require('mongoose');

// Connects to MongoDB using the URI from .env
// Called once when the server starts up
async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1); // stop the server if the DB isn't reachable
  }
}

module.exports = connectDB;
