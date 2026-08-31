const Parish = require('../models/parishModel');

// @desc    Create a new parish
// @route   POST /api/parishes
// @access  Private
const createParish = async (req, res) => {
  try {
    const { name, religion } = req.body;

    if (!name || !religion) {
      return res.status(400).json({ message: 'Parish name and religion are required' });
    }

    const parishExists = await Parish.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

    if (parishExists) {
      return res.status(400).json({ message: 'Parish already exists' });
    }

    const parish = await Parish.create({
      name,
      religion
    });

    res.status(201).json(parish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all parishes
// @route   GET /api/parishes
// @access  Private
const getParishes = async (req, res) => {
  try {
    const parishes = await Parish.find({}).sort({ createdAt: -1 });
    res.status(200).json(parishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a parish
// @route   PUT /api/parishes/:id
// @access  Private
const updateParish = async (req, res) => {
  try {
    const { name, religion, isActive } = req.body;
    const parish = await Parish.findById(req.params.id);

    if (!parish) {
      return res.status(404).json({ message: 'Parish not found' });
    }

    if (name && name.toLowerCase() !== parish.name.toLowerCase()) {
      const parishExists = await Parish.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
      if (parishExists) {
        return res.status(400).json({ message: 'Parish name already in use' });
      }
    }

    if (name) parish.name = name;
    if (religion) parish.religion = religion;
    if (isActive !== undefined) parish.isActive = isActive;

    const updatedParish = await parish.save();
    res.status(200).json(updatedParish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a parish
// @route   DELETE /api/parishes/:id
// @access  Private
const deleteParish = async (req, res) => {
  try {
    const parish = await Parish.findById(req.params.id);

    if (!parish) {
      return res.status(404).json({ message: 'Parish not found' });
    }

    await parish.deleteOne();
    res.status(200).json({ message: 'Parish removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createParish,
  getParishes,
  updateParish,
  deleteParish
};
