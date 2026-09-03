const MotherTongue = require('../models/motherTongueModel');

// @desc    Create a new mother tongue
// @route   POST /api/mother-tongues
// @access  Private
const createMotherTongue = async (req, res) => {
  try {
    const { motherTongueName } = req.body;

    if (!motherTongueName) {
      return res.status(400).json({ message: 'Mother Tongue name is required' });
    }

    const exists = await MotherTongue.findOne({ motherTongueName: { $regex: new RegExp(`^${motherTongueName}$`, 'i') } });

    if (exists) {
      return res.status(400).json({ message: 'Mother Tongue already exists' });
    }

    const motherTongue = await MotherTongue.create({
      motherTongueName
    });

    res.status(201).json(motherTongue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all mother tongues
// @route   GET /api/mother-tongues
// @access  Private
const getMotherTongues = async (req, res) => {
  try {
    const motherTongues = await MotherTongue.find({}).sort({ createdAt: -1 });
    res.status(200).json(motherTongues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get mother tongue by ID
// @route   GET /api/mother-tongues/:id
// @access  Private
const getMotherTongueById = async (req, res) => {
  try {
    const motherTongue = await MotherTongue.findById(req.params.id);
    if (!motherTongue) {
      return res.status(404).json({ message: 'Mother Tongue not found' });
    }
    res.status(200).json(motherTongue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a mother tongue
// @route   PUT /api/mother-tongues/:id
// @access  Private
const updateMotherTongue = async (req, res) => {
  try {
    const { motherTongueName, isActive } = req.body;
    const motherTongue = await MotherTongue.findById(req.params.id);

    if (!motherTongue) {
      return res.status(404).json({ message: 'Mother Tongue not found' });
    }

    if (motherTongueName && motherTongueName.toLowerCase() !== motherTongue.motherTongueName.toLowerCase()) {
      const exists = await MotherTongue.findOne({ motherTongueName: { $regex: new RegExp(`^${motherTongueName}$`, 'i') } });
      if (exists) {
        return res.status(400).json({ message: 'Mother Tongue name already in use' });
      }
    }

    if (motherTongueName) motherTongue.motherTongueName = motherTongueName;
    if (isActive !== undefined) motherTongue.isActive = isActive;

    const updatedMotherTongue = await motherTongue.save();
    res.status(200).json(updatedMotherTongue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a mother tongue
// @route   DELETE /api/mother-tongues/:id
// @access  Private
const deleteMotherTongue = async (req, res) => {
  try {
    const motherTongue = await MotherTongue.findById(req.params.id);

    if (!motherTongue) {
      return res.status(404).json({ message: 'Mother Tongue not found' });
    }

    await motherTongue.deleteOne();
    res.status(200).json({ message: 'Mother Tongue removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMotherTongue,
  getMotherTongues,
  getMotherTongueById,
  updateMotherTongue,
  deleteMotherTongue
};
