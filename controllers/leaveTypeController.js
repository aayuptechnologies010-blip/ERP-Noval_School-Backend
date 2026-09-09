const LeaveType = require('../models/leaveTypeModel');

// @desc    Create new leave type
// @route   POST /api/leave-types
const createLeaveType = async (req, res) => {
  try {
    const { leaveAbbr } = req.body;
    
    // Check duplicate abbreviation
    const exists = await LeaveType.findOne({ 
      leaveAbbr: { $regex: new RegExp(`^${leaveAbbr}$`, 'i') } 
    });
    
    if (exists) {
      return res.status(400).json({ message: 'Leave Abbreviation already exists' });
    }

    const leaveType = await LeaveType.create(req.body);
    res.status(201).json(leaveType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all leave types
// @route   GET /api/leave-types
const getLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await LeaveType.find({});
    res.json(leaveTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update leave type
// @route   PUT /api/leave-types/:id
const updateLeaveType = async (req, res) => {
  try {
    const leaveType = await LeaveType.findById(req.params.id);
    
    if (leaveType) {
      if (req.body.leaveAbbr && req.body.leaveAbbr.toLowerCase() !== leaveType.leaveAbbr.toLowerCase()) {
        const exists = await LeaveType.findOne({ 
          leaveAbbr: { $regex: new RegExp(`^${req.body.leaveAbbr}$`, 'i') } 
        });
        if (exists) {
          return res.status(400).json({ message: 'Leave Abbreviation already exists' });
        }
      }
      
      // Update all fields provided
      Object.assign(leaveType, req.body);
      const updatedLeaveType = await leaveType.save();
      res.json(updatedLeaveType);
    } else {
      res.status(404).json({ message: 'Leave Type not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete leave type
// @route   DELETE /api/leave-types/:id
const deleteLeaveType = async (req, res) => {
  try {
    const leaveType = await LeaveType.findByIdAndDelete(req.params.id);
    if (leaveType) {
      res.json({ message: 'Leave Type removed' });
    } else {
      res.status(404).json({ message: 'Leave Type not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createLeaveType, getLeaveTypes, updateLeaveType, deleteLeaveType };
