const SchoolGlobalFeeType = require('../models/schoolGlobalFeeTypeModel');

// @desc    Create new school global details with fee type
// @route   POST /api/school-global-fee-types
// @access  Private
const createSchoolGlobalFeeType = async (req, res) => {
  try {
    const { schoolName, feeType } = req.body;

    if (!schoolName || !feeType) {
      return res.status(400).json({ message: 'School name and fee type are required' });
    }

    const details = await SchoolGlobalFeeType.create(req.body);

    res.status(201).json(details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all school global details with fee types
// @route   GET /api/school-global-fee-types
// @access  Private
const getSchoolGlobalFeeTypes = async (req, res) => {
  try {
    const details = await SchoolGlobalFeeType.find({}).sort({ createdAt: -1 });
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get details by ID
// @route   GET /api/school-global-fee-types/:id
// @access  Private
const getSchoolGlobalFeeTypeById = async (req, res) => {
  try {
    const details = await SchoolGlobalFeeType.findById(req.params.id);
    if (!details) {
      return res.status(404).json({ message: 'Details not found' });
    }
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update details
// @route   PUT /api/school-global-fee-types/:id
// @access  Private
const updateSchoolGlobalFeeType = async (req, res) => {
  try {
    const updatedDetails = await SchoolGlobalFeeType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedDetails) {
      return res.status(404).json({ message: 'Details not found' });
    }

    res.status(200).json(updatedDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete details
// @route   DELETE /api/school-global-fee-types/:id
// @access  Private
const deleteSchoolGlobalFeeType = async (req, res) => {
  try {
    const details = await SchoolGlobalFeeType.findById(req.params.id);

    if (!details) {
      return res.status(404).json({ message: 'Details not found' });
    }

    await details.deleteOne();
    res.status(200).json({ message: 'Details removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSchoolGlobalFeeType,
  getSchoolGlobalFeeTypes,
  getSchoolGlobalFeeTypeById,
  updateSchoolGlobalFeeType,
  deleteSchoolGlobalFeeType
};
