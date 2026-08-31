const SchoolGlobalDetails = require('../models/schoolGlobalDetailsModel');

// @desc    Create new school global details
// @route   POST /api/school-global-details
// @access  Private
const createSchoolDetails = async (req, res) => {
  try {
    const { schoolName } = req.body;

    if (!schoolName) {
      return res.status(400).json({ message: 'School name is required' });
    }

    const schoolDetails = await SchoolGlobalDetails.create(req.body);

    res.status(201).json(schoolDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all school global details
// @route   GET /api/school-global-details
// @access  Private
const getSchoolDetails = async (req, res) => {
  try {
    const details = await SchoolGlobalDetails.find({}).sort({ createdAt: -1 });
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get school details by ID
// @route   GET /api/school-global-details/:id
// @access  Private
const getSchoolDetailsById = async (req, res) => {
  try {
    const details = await SchoolGlobalDetails.findById(req.params.id);
    if (!details) {
      return res.status(404).json({ message: 'School details not found' });
    }
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update school global details
// @route   PUT /api/school-global-details/:id
// @access  Private
const updateSchoolDetails = async (req, res) => {
  try {
    const updatedDetails = await SchoolGlobalDetails.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedDetails) {
      return res.status(404).json({ message: 'School details not found' });
    }

    res.status(200).json(updatedDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete school global details
// @route   DELETE /api/school-global-details/:id
// @access  Private
const deleteSchoolDetails = async (req, res) => {
  try {
    const details = await SchoolGlobalDetails.findById(req.params.id);

    if (!details) {
      return res.status(404).json({ message: 'School details not found' });
    }

    await details.deleteOne();
    res.status(200).json({ message: 'School details removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSchoolDetails,
  getSchoolDetails,
  getSchoolDetailsById,
  updateSchoolDetails,
  deleteSchoolDetails
};
