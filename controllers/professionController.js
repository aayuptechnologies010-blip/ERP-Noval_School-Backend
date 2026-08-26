const Profession = require('../models/professionModel');

// @desc    Create a new profession
// @route   POST /api/professions
// @access  Private (Admin/Admission Manager)
const createProfession = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Profession name is required' });
    }

    // Check if profession already exists
    const professionExists = await Profession.findOne({ name: name.toUpperCase() });

    if (professionExists) {
      return res.status(400).json({ message: 'Profession already exists' });
    }

    const profession = await Profession.create({
      name
    });

    res.status(201).json(profession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all professions
// @route   GET /api/professions
// @access  Private
const getProfessions = async (req, res) => {
  try {
    const professions = await Profession.find({}).sort({ createdAt: -1 });
    res.status(200).json(professions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a profession
// @route   PUT /api/professions/:id
// @access  Private
const updateProfession = async (req, res) => {
  try {
    const { name, isActive } = req.body;

    const profession = await Profession.findById(req.params.id);

    if (!profession) {
      return res.status(404).json({ message: 'Profession not found' });
    }

    // Check if updating to a name that already exists
    if (name && name.toUpperCase() !== profession.name) {
      const professionExists = await Profession.findOne({ name: name.toUpperCase() });
      if (professionExists) {
        return res.status(400).json({ message: 'Profession name already in use' });
      }
    }

    if (name) profession.name = name;
    if (isActive !== undefined) profession.isActive = isActive;

    const updatedProfession = await profession.save();
    res.status(200).json(updatedProfession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a profession
// @route   DELETE /api/professions/:id
// @access  Private
const deleteProfession = async (req, res) => {
  try {
    const profession = await Profession.findById(req.params.id);

    if (!profession) {
      return res.status(404).json({ message: 'Profession not found' });
    }

    await profession.deleteOne();
    res.status(200).json({ message: 'Profession removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProfession,
  getProfessions,
  updateProfession,
  deleteProfession
};
