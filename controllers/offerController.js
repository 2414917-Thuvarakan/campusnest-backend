const Offer = require('../models/Offer');

// POST /api/offers - post a new student offer (login required)
async function createOffer(req, res) {
  try {
    const { title, shopName, discount, category, location, validTill } = req.body;

    if (!title || !shopName || !discount) {
      return res.status(400).json({ message: 'Title, shop name and discount are required' });
    }

    const offer = await Offer.create({
      title,
      shopName,
      discount,
      category,
      location,
      validTill,
      postedBy: req.user._id,
    });

    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ message: 'Could not create offer', error: error.message });
  }
}

// GET /api/offers - list all active offers (public)
async function getOffers(req, res) {
  try {
    const filter = { isActive: true };
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const offers = await Offer.find(filter)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch offers', error: error.message });
  }
}

// GET /api/offers/:id - get one offer's details (public)
async function getOfferById(req, res) {
  try {
    const offer = await Offer.findById(req.params.id).populate('postedBy', 'name email');
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch offer', error: error.message });
  }
}

// PUT /api/offers/:id - update an offer (only the person who posted it)
async function updateOffer(req, res) {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    if (offer.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own offers' });
    }

    Object.assign(offer, req.body);
    await offer.save();

    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: 'Could not update offer', error: error.message });
  }
}

// DELETE /api/offers/:id - delete an offer (only the person who posted it)
async function deleteOffer(req, res) {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    if (offer.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own offers' });
    }

    await offer.deleteOne();
    res.json({ message: 'Offer deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Could not delete offer', error: error.message });
  }
}

module.exports = { createOffer, getOffers, getOfferById, updateOffer, deleteOffer };