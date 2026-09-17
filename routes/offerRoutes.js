const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createOffer,
  getOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
} = require('../controllers/offerController');

// Anyone can browse offers - no login needed
router.get('/', getOffers);
router.get('/:id', getOfferById);

// Only logged-in users can post, edit or delete an offer
router.post('/', protect, createOffer);
router.put('/:id', protect, updateOffer);
router.delete('/:id', protect, deleteOffer);

module.exports = router;