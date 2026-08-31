const SubCaste = require('../models/subCasteModel');

// @desc    Create a new sub caste
// @route   POST /api/sub-castes
// @access  Private
const createSubCaste = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Sub Caste name is required' });
    }

    const subCasteExists = await SubCaste.findOne({ name: name.toUpperCase() });

    if (subCasteExists) {
      return res.status(400).json({ message: 'Sub Caste already exists' });
    }

    const subCaste = await SubCaste.create({ name });
    res.status(201).json(subCaste);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all sub castes
// @route   GET /api/sub-castes
// @access  Private
const getSubCastes = async (req, res) => {
  try {
    const subCastes = await SubCaste.find({}).sort({ createdAt: -1 });
    res.status(200).json(subCastes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a sub caste
// @route   PUT /api/sub-castes/:id
// @access  Private
const updateSubCaste = async (req, res) => {
  try {
    const { name, isActive } = req.body;
    const subCaste = await SubCaste.findById(req.params.id);

    if (!subCaste) {
      return res.status(404).json({ message: 'Sub Caste not found' });
    }

    if (name && name.toUpperCase() !== subCaste.name) {
      const subCasteExists = await SubCaste.findOne({ name: name.toUpperCase() });
      if (subCasteExists) {
        return res.status(400).json({ message: 'Sub Caste name already in use' });
      }
    }

    if (name) subCaste.name = name;
    if (isActive !== undefined) subCaste.isActive = isActive;

    const updatedSubCaste = await subCaste.save();
    res.status(200).json(updatedSubCaste);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a sub caste
// @route   DELETE /api/sub-castes/:id
// @access  Private
const deleteSubCaste = async (req, res) => {
  try {
    const subCaste = await SubCaste.findById(req.params.id);

    if (!subCaste) {
      return res.status(404).json({ message: 'Sub Caste not found' });
    }

    await subCaste.deleteOne();
    res.status(200).json({ message: 'Sub Caste removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSubCaste,
  getSubCastes,
  updateSubCaste,
  deleteSubCaste
};
