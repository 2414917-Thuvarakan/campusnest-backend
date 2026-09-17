const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');

// Anyone can browse jobs - no login needed
router.get('/', getJobs);
router.get('/:id', getJobById);

// Only logged-in users can post, edit or delete a job listing
router.post('/', protect, createJob);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

module.exports = router;