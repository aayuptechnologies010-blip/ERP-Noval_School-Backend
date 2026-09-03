const LastResult = require('../models/lastResultModel');

// @desc    Create a new last result
// @route   POST /api/last-results
// @access  Private
const createLastResult = async (req, res) => {
  try {
    const { lastResultName } = req.body;

    if (!lastResultName) {
      return res.status(400).json({ message: 'Last Result name is required' });
    }

    const exists = await LastResult.findOne({ lastResultName: { $regex: new RegExp(`^${lastResultName}$`, 'i') } });

    if (exists) {
      return res.status(400).json({ message: 'Last Result already exists' });
    }

    const lastResult = await LastResult.create({
      lastResultName
    });

    res.status(201).json(lastResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all last results
// @route   GET /api/last-results
// @access  Private
const getLastResults = async (req, res) => {
  try {
    const lastResults = await LastResult.find({}).sort({ createdAt: -1 });
    res.status(200).json(lastResults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get last result by ID
// @route   GET /api/last-results/:id
// @access  Private
const getLastResultById = async (req, res) => {
  try {
    const lastResult = await LastResult.findById(req.params.id);
    if (!lastResult) {
      return res.status(404).json({ message: 'Last Result not found' });
    }
    res.status(200).json(lastResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a last result
// @route   PUT /api/last-results/:id
// @access  Private
const updateLastResult = async (req, res) => {
  try {
    const { lastResultName, isActive } = req.body;
    const lastResult = await LastResult.findById(req.params.id);

    if (!lastResult) {
      return res.status(404).json({ message: 'Last Result not found' });
    }

    if (lastResultName && lastResultName.toLowerCase() !== lastResult.lastResultName.toLowerCase()) {
      const exists = await LastResult.findOne({ lastResultName: { $regex: new RegExp(`^${lastResultName}$`, 'i') } });
      if (exists) {
        return res.status(400).json({ message: 'Last Result name already in use' });
      }
    }

    if (lastResultName) lastResult.lastResultName = lastResultName;
    if (isActive !== undefined) lastResult.isActive = isActive;

    const updatedLastResult = await lastResult.save();
    res.status(200).json(updatedLastResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a last result
// @route   DELETE /api/last-results/:id
// @access  Private
const deleteLastResult = async (req, res) => {
  try {
    const lastResult = await LastResult.findById(req.params.id);

    if (!lastResult) {
      return res.status(404).json({ message: 'Last Result not found' });
    }

    await lastResult.deleteOne();
    res.status(200).json({ message: 'Last Result removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLastResult,
  getLastResults,
  getLastResultById,
  updateLastResult,
  deleteLastResult
};
