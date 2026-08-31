const Caste = require('../models/casteModel');

// @desc    Create a new caste
// @route   POST /api/castes
// @access  Private
const createCaste = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Caste name is required' });
    }

    const casteExists = await Caste.findOne({ name: name.toUpperCase() });

    if (casteExists) {
      return res.status(400).json({ message: 'Caste already exists' });
    }

    const caste = await Caste.create({ name });
    res.status(201).json(caste);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all castes
// @route   GET /api/castes
// @access  Private
const getCastes = async (req, res) => {
  try {
    const castes = await Caste.find({}).sort({ createdAt: -1 });
    res.status(200).json(castes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a caste
// @route   PUT /api/castes/:id
// @access  Private
const updateCaste = async (req, res) => {
  try {
    const { name, isActive } = req.body;
    const caste = await Caste.findById(req.params.id);

    if (!caste) {
      return res.status(404).json({ message: 'Caste not found' });
    }

    if (name && name.toUpperCase() !== caste.name) {
      const casteExists = await Caste.findOne({ name: name.toUpperCase() });
      if (casteExists) {
        return res.status(400).json({ message: 'Caste name already in use' });
      }
    }

    if (name) caste.name = name;
    if (isActive !== undefined) caste.isActive = isActive;

    const updatedCaste = await caste.save();
    res.status(200).json(updatedCaste);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a caste
// @route   DELETE /api/castes/:id
// @access  Private
const deleteCaste = async (req, res) => {
  try {
    const caste = await Caste.findById(req.params.id);

    if (!caste) {
      return res.status(404).json({ message: 'Caste not found' });
    }

    await caste.deleteOne();
    res.status(200).json({ message: 'Caste removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCaste,
  getCastes,
  updateCaste,
  deleteCaste
};
