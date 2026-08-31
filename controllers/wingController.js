const Wing = require('../models/wingModel');

// @desc    Create a new wing
// @route   POST /api/wings
// @access  Private
const createWing = async (req, res) => {
  try {
    const { wingName } = req.body;

    if (!wingName) {
      return res.status(400).json({ message: 'Wing name is required' });
    }

    const wingExists = await Wing.findOne({ wingName: wingName.toUpperCase() });

    if (wingExists) {
      return res.status(400).json({ message: 'Wing already exists' });
    }

    const wing = await Wing.create({
      wingName: wingName.toUpperCase()
    });

    res.status(201).json(wing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all wings
// @route   GET /api/wings
// @access  Private
const getWings = async (req, res) => {
  try {
    const wings = await Wing.find({}).sort({ createdAt: -1 });
    res.status(200).json(wings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get wing by ID
// @route   GET /api/wings/:id
// @access  Private
const getWingById = async (req, res) => {
  try {
    const wing = await Wing.findById(req.params.id);
    if (!wing) {
      return res.status(404).json({ message: 'Wing not found' });
    }
    res.status(200).json(wing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a wing
// @route   PUT /api/wings/:id
// @access  Private
const updateWing = async (req, res) => {
  try {
    const { wingName, isActive } = req.body;
    const wing = await Wing.findById(req.params.id);

    if (!wing) {
      return res.status(404).json({ message: 'Wing not found' });
    }

    if (wingName && wingName.toUpperCase() !== wing.wingName) {
      const wingExists = await Wing.findOne({ wingName: wingName.toUpperCase() });
      if (wingExists) {
        return res.status(400).json({ message: 'Wing name already in use' });
      }
    }

    if (wingName) wing.wingName = wingName.toUpperCase();
    if (isActive !== undefined) wing.isActive = isActive;

    const updatedWing = await wing.save();
    res.status(200).json(updatedWing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a wing
// @route   DELETE /api/wings/:id
// @access  Private
const deleteWing = async (req, res) => {
  try {
    const wing = await Wing.findById(req.params.id);

    if (!wing) {
      return res.status(404).json({ message: 'Wing not found' });
    }

    await wing.deleteOne();
    res.status(200).json({ message: 'Wing removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createWing,
  getWings,
  getWingById,
  updateWing,
  deleteWing
};
