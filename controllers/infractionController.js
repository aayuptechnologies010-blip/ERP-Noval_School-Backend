const Infraction = require('../models/infractionModel');

// @desc    Create a new infraction definition
// @route   POST /api/infractions
// @access  Private
const createInfraction = async (req, res) => {
  try {
    const { title, severity, penaltyPoints, description } = req.body;

    if (!title || !severity || penaltyPoints === undefined || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const infraction = await Infraction.create({
      title,
      severity,
      penaltyPoints,
      description,
      createdBy: req.user ? req.user._id : undefined
    });

    res.status(201).json(infraction);
  } catch (error) {
    res.status(500).json({ message: 'Error creating infraction', error: error.message });
  }
};

// @desc    Get all infraction definitions
// @route   GET /api/infractions
// @access  Private
const getInfractions = async (req, res) => {
  try {
    const infractions = await Infraction.find().sort({ createdAt: -1 });
    res.status(200).json(infractions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching infractions', error: error.message });
  }
};

// @desc    Get a single infraction definition by ID
// @route   GET /api/infractions/:id
// @access  Private
const getInfractionById = async (req, res) => {
  try {
    const infraction = await Infraction.findById(req.params.id);
    if (!infraction) {
      return res.status(404).json({ message: 'Infraction not found' });
    }
    res.status(200).json(infraction);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching infraction', error: error.message });
  }
};

// @desc    Update an infraction definition
// @route   PUT /api/infractions/:id
// @access  Private
const updateInfraction = async (req, res) => {
  try {
    const { title, severity, penaltyPoints, description } = req.body;
    
    const infraction = await Infraction.findByIdAndUpdate(
      req.params.id,
      { title, severity, penaltyPoints, description },
      { new: true, runValidators: true }
    );

    if (!infraction) {
      return res.status(404).json({ message: 'Infraction not found' });
    }
    
    res.status(200).json(infraction);
  } catch (error) {
    res.status(500).json({ message: 'Error updating infraction', error: error.message });
  }
};

// @desc    Delete an infraction definition
// @route   DELETE /api/infractions/:id
// @access  Private
const deleteInfraction = async (req, res) => {
  try {
    const infraction = await Infraction.findByIdAndDelete(req.params.id);
    if (!infraction) {
      return res.status(404).json({ message: 'Infraction not found' });
    }
    res.status(200).json({ message: 'Infraction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting infraction', error: error.message });
  }
};

module.exports = {
  createInfraction,
  getInfractions,
  getInfractionById,
  updateInfraction,
  deleteInfraction
};
