const StaffAppreciation = require('../models/staffAppreciationModel');

// @desc    Give appreciation to a staff member
// @route   POST /api/staff-appreciations
// @access  Private
const createStaffAppreciation = async (req, res) => {
  try {
    const { staffName, designation, department, appreciationType, points, date } = req.body;

    if (!staffName || !designation || !department || !appreciationType || points === undefined || !date) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const appreciation = await StaffAppreciation.create({
      staffName,
      designation,
      department,
      appreciationType,
      points,
      date,
      createdBy: req.user ? req.user._id : undefined
    });

    res.status(201).json(appreciation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating staff appreciation', error: error.message });
  }
};

// @desc    Get all staff appreciations
// @route   GET /api/staff-appreciations
// @access  Private
const getStaffAppreciations = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { staffName: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }

    const appreciations = await StaffAppreciation.find(filter).sort({ date: -1 });
    res.status(200).json(appreciations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff appreciations', error: error.message });
  }
};

// @desc    Get a single staff appreciation by ID
// @route   GET /api/staff-appreciations/:id
// @access  Private
const getStaffAppreciationById = async (req, res) => {
  try {
    const appreciation = await StaffAppreciation.findById(req.params.id);
    if (!appreciation) {
      return res.status(404).json({ message: 'Staff appreciation not found' });
    }
    res.status(200).json(appreciation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff appreciation', error: error.message });
  }
};

// @desc    Update a staff appreciation
// @route   PUT /api/staff-appreciations/:id
// @access  Private
const updateStaffAppreciation = async (req, res) => {
  try {
    const { staffName, designation, department, appreciationType, points, date } = req.body;
    
    const appreciation = await StaffAppreciation.findByIdAndUpdate(
      req.params.id,
      { staffName, designation, department, appreciationType, points, date },
      { new: true, runValidators: true }
    );

    if (!appreciation) {
      return res.status(404).json({ message: 'Staff appreciation not found' });
    }
    
    res.status(200).json(appreciation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating staff appreciation', error: error.message });
  }
};

// @desc    Delete a staff appreciation
// @route   DELETE /api/staff-appreciations/:id
// @access  Private
const deleteStaffAppreciation = async (req, res) => {
  try {
    const appreciation = await StaffAppreciation.findByIdAndDelete(req.params.id);
    if (!appreciation) {
      return res.status(404).json({ message: 'Staff appreciation not found' });
    }
    res.status(200).json({ message: 'Staff appreciation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting staff appreciation', error: error.message });
  }
};

module.exports = {
  createStaffAppreciation,
  getStaffAppreciations,
  getStaffAppreciationById,
  updateStaffAppreciation,
  deleteStaffAppreciation
};
