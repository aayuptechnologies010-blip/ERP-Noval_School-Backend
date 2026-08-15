const StaffInfraction = require('../models/staffInfractionModel');

// @desc    Record a staff infraction
// @route   POST /api/staff-infractions
// @access  Private
const createStaffInfraction = async (req, res) => {
  try {
    const { staffName, designation, department, date, infractionType, severity, consequence, notes } = req.body;

    if (!staffName || !designation || !department || !date || !infractionType || !severity || !consequence) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const infraction = await StaffInfraction.create({
      staffName,
      designation,
      department,
      date,
      infractionType,
      severity,
      consequence,
      notes,
      createdBy: req.user ? req.user._id : undefined
    });

    res.status(201).json(infraction);
  } catch (error) {
    res.status(500).json({ message: 'Error recording staff infraction', error: error.message });
  }
};

// @desc    Get all staff infractions
// @route   GET /api/staff-infractions
// @access  Private
const getStaffInfractions = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { staffName: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }

    const infractions = await StaffInfraction.find(filter).sort({ date: -1 });
    res.status(200).json(infractions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff infractions', error: error.message });
  }
};

// @desc    Get a single staff infraction by ID
// @route   GET /api/staff-infractions/:id
// @access  Private
const getStaffInfractionById = async (req, res) => {
  try {
    const infraction = await StaffInfraction.findById(req.params.id);
    if (!infraction) {
      return res.status(404).json({ message: 'Staff infraction not found' });
    }
    res.status(200).json(infraction);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff infraction', error: error.message });
  }
};

// @desc    Update a staff infraction
// @route   PUT /api/staff-infractions/:id
// @access  Private
const updateStaffInfraction = async (req, res) => {
  try {
    const { staffName, designation, department, date, infractionType, severity, consequence, notes } = req.body;
    
    const infraction = await StaffInfraction.findByIdAndUpdate(
      req.params.id,
      { staffName, designation, department, date, infractionType, severity, consequence, notes },
      { new: true, runValidators: true }
    );

    if (!infraction) {
      return res.status(404).json({ message: 'Staff infraction not found' });
    }
    
    res.status(200).json(infraction);
  } catch (error) {
    res.status(500).json({ message: 'Error updating staff infraction', error: error.message });
  }
};

// @desc    Delete a staff infraction
// @route   DELETE /api/staff-infractions/:id
// @access  Private
const deleteStaffInfraction = async (req, res) => {
  try {
    const infraction = await StaffInfraction.findByIdAndDelete(req.params.id);
    if (!infraction) {
      return res.status(404).json({ message: 'Staff infraction not found' });
    }
    res.status(200).json({ message: 'Staff infraction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting staff infraction', error: error.message });
  }
};

module.exports = {
  createStaffInfraction,
  getStaffInfractions,
  getStaffInfractionById,
  updateStaffInfraction,
  deleteStaffInfraction
};
