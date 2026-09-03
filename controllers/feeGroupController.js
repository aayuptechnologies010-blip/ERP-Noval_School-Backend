const FeeGroup = require('../models/feeGroupModel');

// @desc    Get all fee groups
// @route   GET /api/fee-groups
// @access  Private
const getFeeGroups = async (req, res) => {
  try {
    const feeGroups = await FeeGroup.find().sort({ createdAt: -1 });
    res.json(feeGroups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create fee group
// @route   POST /api/fee-groups
// @access  Private
const createFeeGroup = async (req, res) => {
  try {
    const { name, special } = req.body;
    
    const exists = await FeeGroup.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: 'Fee Group already exists' });
    }

    const feeGroup = await FeeGroup.create({ name, special });
    res.status(201).json(feeGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update fee group
// @route   PUT /api/fee-groups/:id
// @access  Private
const updateFeeGroup = async (req, res) => {
  try {
    const { name, special } = req.body;
    const feeGroup = await FeeGroup.findById(req.params.id);

    if (feeGroup) {
      feeGroup.name = name || feeGroup.name;
      feeGroup.special = special || feeGroup.special;

      const updated = await feeGroup.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Fee Group not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete fee group
// @route   DELETE /api/fee-groups/:id
// @access  Private
const deleteFeeGroup = async (req, res) => {
  try {
    const feeGroup = await FeeGroup.findById(req.params.id);

    if (feeGroup) {
      await feeGroup.deleteOne();
      res.json({ message: 'Fee Group removed' });
    } else {
      res.status(404).json({ message: 'Fee Group not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFeeGroups,
  createFeeGroup,
  updateFeeGroup,
  deleteFeeGroup
};
