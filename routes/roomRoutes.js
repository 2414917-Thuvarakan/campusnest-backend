const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');

// Anyone can browse rooms - no login needed
router.get('/', getRooms);
router.get('/:id', getRoomById);

// Only logged-in users can post, edit or delete a room listing
router.post('/', protect, createRoom);
router.put('/:id', protect, updateRoom);
router.delete('/:id', protect, deleteRoom);

module.exports = router;