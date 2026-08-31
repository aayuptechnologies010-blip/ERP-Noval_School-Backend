const Club = require('../models/clubModel');

// @desc    Create a new club
// @route   POST /api/clubs
// @access  Private
const createClub = async (req, res) => {
  try {
    const { clubName } = req.body;

    if (!clubName) {
      return res.status(400).json({ message: 'Club name is required' });
    }

    const clubExists = await Club.findOne({ clubName: clubName.toUpperCase() });

    if (clubExists) {
      return res.status(400).json({ message: 'Club already exists' });
    }

    const club = await Club.create({
      clubName: clubName.toUpperCase()
    });

    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Private
const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find({}).sort({ createdAt: -1 });
    res.status(200).json(clubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get club by ID
// @route   GET /api/clubs/:id
// @access  Private
const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    res.status(200).json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a club
// @route   PUT /api/clubs/:id
// @access  Private
const updateClub = async (req, res) => {
  try {
    const { clubName, isActive } = req.body;
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    if (clubName && clubName.toUpperCase() !== club.clubName) {
      const clubExists = await Club.findOne({ clubName: clubName.toUpperCase() });
      if (clubExists) {
        return res.status(400).json({ message: 'Club name already in use' });
      }
    }

    if (clubName) club.clubName = clubName.toUpperCase();
    if (isActive !== undefined) club.isActive = isActive;

    const updatedClub = await club.save();
    res.status(200).json(updatedClub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a club
// @route   DELETE /api/clubs/:id
// @access  Private
const deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    await club.deleteOne();
    res.status(200).json({ message: 'Club removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createClub,
  getClubs,
  getClubById,
  updateClub,
  deleteClub
};
