const Room = require('../models/Room');

// POST /api/rooms - create a new room listing (login required)
async function createRoom(req, res) {
  try {
    const { title, rent, location, sharingType, description, photos, contactNumber } = req.body;

    if (!title || !rent || !location) {
      return res.status(400).json({ message: 'Title, rent and location are required' });
    }

    const room = await Room.create({
      title,
      rent,
      location,
      sharingType,
      description,
      photos,
      contactNumber,
      postedBy: req.user._id, // comes from the auth middleware
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Could not create room listing', error: error.message });
  }
}

// GET /api/rooms - list all available rooms (public, no login needed)
async function getRooms(req, res) {
  try {
    // Optional query filters, e.g. /api/rooms?maxRent=6000&location=anna
    const filter = { isAvailable: true };
    if (req.query.maxRent) {
      filter.rent = { $lte: Number(req.query.maxRent) };
    }
    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: 'i' }; // case-insensitive search
    }

    const rooms = await Room.find(filter)
      .populate('postedBy', 'name email') // include poster's name/email, not password
      .sort({ createdAt: -1 }); // newest first

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch rooms', error: error.message });
  }
}

// GET /api/rooms/:id - get a single room's details (public)
async function getRoomById(req, res) {
  try {
    const room = await Room.findById(req.params.id).populate('postedBy', 'name email');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch room', error: error.message });
  }
}

// PUT /api/rooms/:id - update a room (only the person who posted it)
async function updateRoom(req, res) {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Ownership check - only the original poster can edit their listing
    if (room.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own listings' });
    }

    Object.assign(room, req.body); // apply whichever fields were sent
    await room.save();

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Could not update room', error: error.message });
  }
}

// DELETE /api/rooms/:id - delete a room (only the person who posted it)
async function deleteRoom(req, res) {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own listings' });
    }

    await room.deleteOne();
    res.json({ message: 'Room listing deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Could not delete room', error: error.message });
  }
}

module.exports = { createRoom, getRooms, getRoomById, updateRoom, deleteRoom };