const Religion = require('../models/religionModel');

// @desc    Create a new religion
// @route   POST /api/religions
// @access  Private
const createReligion = async (req, res) => {
  try {
    const { religionName } = req.body;

    if (!religionName) {
      return res.status(400).json({ message: 'Religion name is required' });
    }

    const religionExists = await Religion.findOne({ religionName: religionName.toUpperCase() });

    if (religionExists) {
      return res.status(400).json({ message: 'Religion already exists' });
    }

    const religion = await Religion.create({
      religionName: religionName.toUpperCase()
    });

    res.status(201).json(religion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all religions
// @route   GET /api/religions
// @access  Private
const getReligions = async (req, res) => {
  try {
    const religions = await Religion.find({}).sort({ createdAt: -1 });
    res.status(200).json(religions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a religion
// @route   PUT /api/religions/:id
// @access  Private
const updateReligion = async (req, res) => {
  try {
    const { religionName, isActive } = req.body;
    const religion = await Religion.findById(req.params.id);

    if (!religion) {
      return res.status(404).json({ message: 'Religion not found' });
    }

    if (religionName && religionName.toUpperCase() !== religion.religionName) {
      const religionExists = await Religion.findOne({ religionName: religionName.toUpperCase() });
      if (religionExists) {
        return res.status(400).json({ message: 'Religion name already in use' });
      }
    }

    if (religionName) religion.religionName = religionName.toUpperCase();
    if (isActive !== undefined) religion.isActive = isActive;

    const updatedReligion = await religion.save();
    res.status(200).json(updatedReligion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a religion
// @route   DELETE /api/religions/:id
// @access  Private
const deleteReligion = async (req, res) => {
  try {
    const religion = await Religion.findById(req.params.id);

    if (!religion) {
      return res.status(404).json({ message: 'Religion not found' });
    }

    await religion.deleteOne();
    res.status(200).json({ message: 'Religion removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReligion,
  getReligions,
  updateReligion,
  deleteReligion
};
