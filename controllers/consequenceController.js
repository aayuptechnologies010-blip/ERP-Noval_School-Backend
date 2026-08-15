const Consequence = require('../models/consequenceModel');

// @desc    Create a new consequence definition
// @route   POST /api/consequences
// @access  Private
const createConsequence = async (req, res) => {
  try {
    const { title, infractionType, actionType, description, notifyParent } = req.body;

    if (!title || !infractionType || !actionType || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const consequence = await Consequence.create({
      title,
      infractionType,
      actionType,
      description,
      notifyParent: notifyParent || false,
      createdBy: req.user ? req.user._id : undefined
    });

    res.status(201).json(consequence);
  } catch (error) {
    res.status(500).json({ message: 'Error creating consequence', error: error.message });
  }
};

// @desc    Get all consequence definitions
// @route   GET /api/consequences
// @access  Private
const getConsequences = async (req, res) => {
  try {
    const consequences = await Consequence.find().sort({ createdAt: -1 });
    res.status(200).json(consequences);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching consequences', error: error.message });
  }
};

// @desc    Get a single consequence definition by ID
// @route   GET /api/consequences/:id
// @access  Private
const getConsequenceById = async (req, res) => {
  try {
    const consequence = await Consequence.findById(req.params.id);
    if (!consequence) {
      return res.status(404).json({ message: 'Consequence not found' });
    }
    res.status(200).json(consequence);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching consequence', error: error.message });
  }
};

// @desc    Update a consequence definition
// @route   PUT /api/consequences/:id
// @access  Private
const updateConsequence = async (req, res) => {
  try {
    const { title, infractionType, actionType, description, notifyParent } = req.body;
    
    const consequence = await Consequence.findByIdAndUpdate(
      req.params.id,
      { title, infractionType, actionType, description, notifyParent },
      { new: true, runValidators: true }
    );

    if (!consequence) {
      return res.status(404).json({ message: 'Consequence not found' });
    }
    
    res.status(200).json(consequence);
  } catch (error) {
    res.status(500).json({ message: 'Error updating consequence', error: error.message });
  }
};

// @desc    Delete a consequence definition
// @route   DELETE /api/consequences/:id
// @access  Private
const deleteConsequence = async (req, res) => {
  try {
    const consequence = await Consequence.findByIdAndDelete(req.params.id);
    if (!consequence) {
      return res.status(404).json({ message: 'Consequence not found' });
    }
    res.status(200).json({ message: 'Consequence deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting consequence', error: error.message });
  }
};

module.exports = {
  createConsequence,
  getConsequences,
  getConsequenceById,
  updateConsequence,
  deleteConsequence
};
