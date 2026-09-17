require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // lets us read JSON from request bodies

// Health check route - visit this to confirm the server is alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CampusNest API is running' });
});

// Auth routes - signup and login
app.use('/api/auth', require('./routes/authRoutes'));

// Rooms, offers and jobs
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/offers', require('./routes/offerRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});