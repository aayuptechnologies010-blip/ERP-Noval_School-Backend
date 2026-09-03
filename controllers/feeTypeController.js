const FeeType = require('../models/feeTypeModel');

// @desc    Get all fee types
// @route   GET /api/fee-types
// @access  Private
const getFeeTypes = async (req, res) => {
  try {
    const feeTypes = await FeeType.find().sort({ pref: 1 });
    res.json(feeTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create fee type
// @route   POST /api/fee-types
// @access  Private
const createFeeType = async (req, res) => {
  try {
    const { name, pref } = req.body;
    
    const feeTypeExists = await FeeType.findOne({ name });
    if (feeTypeExists) {
      return res.status(400).json({ message: 'Fee Type already exists' });
    }

    const feeType = await FeeType.create({ name, pref });
    res.status(201).json(feeType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update fee type
// @route   PUT /api/fee-types/:id
// @access  Private
const updateFeeType = async (req, res) => {
  try {
    const { name, pref } = req.body;
    const feeType = await FeeType.findById(req.params.id);

    if (feeType) {
      feeType.name = name || feeType.name;
      feeType.pref = pref || feeType.pref;

      const updatedFeeType = await feeType.save();
      res.json(updatedFeeType);
    } else {
      res.status(404).json({ message: 'Fee Type not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete fee type
// @route   DELETE /api/fee-types/:id
// @access  Private
const deleteFeeType = async (req, res) => {
  try {
    const feeType = await FeeType.findById(req.params.id);

    if (feeType) {
      await feeType.deleteOne();
      res.json({ message: 'Fee Type removed' });
    } else {
      res.status(404).json({ message: 'Fee Type not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFeeTypes,
  createFeeType,
  updateFeeType,
  deleteFeeType
};
