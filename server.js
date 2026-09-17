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

// Temporary test route for Step 2 - confirms our models load correctly.
// We'll remove this once real routes are built in Step 3-4.
app.get('/api/models-check', (req, res) => {
  const User = require('./models/User');
  const Room = require('./models/Room');
  const Offer = require('./models/Offer');
  const Job = require('./models/Job');
  res.json({
    message: 'All models loaded successfully',
    models: [User.modelName, Room.modelName, Offer.modelName, Job.modelName],
  });
});

// Routes will be added here in later steps:
// app.use('/api/rooms', require('./routes/roomRoutes'));
// app.use('/api/offers', require('./routes/offerRoutes'));
// app.use('/api/jobs', require('./routes/jobRoutes'));
// app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
