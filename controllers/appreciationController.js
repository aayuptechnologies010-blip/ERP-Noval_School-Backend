const Appreciation = require('../models/appreciationModel');

// @desc    Create a new appreciation definition
// @route   POST /api/appreciations
// @access  Private
const createAppreciation = async (req, res) => {
  try {
    const { title, category, points, description } = req.body;

    if (!title || !category || points === undefined || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const appreciation = await Appreciation.create({
      title,
      category,
      points,
      description,
      createdBy: req.user ? req.user._id : undefined
    });

    res.status(201).json(appreciation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating appreciation', error: error.message });
  }
};

// @desc    Get all appreciation definitions
// @route   GET /api/appreciations
// @access  Private
const getAppreciations = async (req, res) => {
  try {
    const appreciations = await Appreciation.find().sort({ createdAt: -1 });
    res.status(200).json(appreciations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appreciations', error: error.message });
  }
};

// @desc    Get a single appreciation definition by ID
// @route   GET /api/appreciations/:id
// @access  Private
const getAppreciationById = async (req, res) => {
  try {
    const appreciation = await Appreciation.findById(req.params.id);
    if (!appreciation) {
      return res.status(404).json({ message: 'Appreciation not found' });
    }
    res.status(200).json(appreciation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appreciation', error: error.message });
  }
};

// @desc    Update an appreciation definition
// @route   PUT /api/appreciations/:id
// @access  Private
const updateAppreciation = async (req, res) => {
  try {
    const { title, category, points, description } = req.body;
    
    const appreciation = await Appreciation.findByIdAndUpdate(
      req.params.id,
      { title, category, points, description },
      { new: true, runValidators: true }
    );

    if (!appreciation) {
      return res.status(404).json({ message: 'Appreciation not found' });
    }
    
    res.status(200).json(appreciation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating appreciation', error: error.message });
  }
};

// @desc    Delete an appreciation definition
// @route   DELETE /api/appreciations/:id
// @access  Private
const deleteAppreciation = async (req, res) => {
  try {
    const appreciation = await Appreciation.findByIdAndDelete(req.params.id);
    if (!appreciation) {
      return res.status(404).json({ message: 'Appreciation not found' });
    }
    res.status(200).json({ message: 'Appreciation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appreciation', error: error.message });
  }
};

module.exports = {
  createAppreciation,
  getAppreciations,
  getAppreciationById,
  updateAppreciation,
  deleteAppreciation
};
