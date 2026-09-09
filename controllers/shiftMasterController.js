const ShiftMaster = require('../models/shiftMasterModel');

// @desc    Create new shift master
// @route   POST /api/shift-masters
const createShiftMaster = async (req, res) => {
  try {
    const { shiftName } = req.body;
    
    // Check duplicate
    const exists = await ShiftMaster.findOne({ 
      shiftName: { $regex: new RegExp(`^${shiftName}$`, 'i') } 
    });
    
    if (exists) {
      return res.status(400).json({ message: 'Shift Name already exists' });
    }

    const shiftMaster = await ShiftMaster.create(req.body);
    res.status(201).json(shiftMaster);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all shift masters
// @route   GET /api/shift-masters
const getShiftMasters = async (req, res) => {
  try {
    const shiftMasters = await ShiftMaster.find({});
    res.json(shiftMasters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update shift master
// @route   PUT /api/shift-masters/:id
const updateShiftMaster = async (req, res) => {
  try {
    const shiftMaster = await ShiftMaster.findById(req.params.id);
    
    if (shiftMaster) {
      if (req.body.shiftName && req.body.shiftName.toLowerCase() !== shiftMaster.shiftName.toLowerCase()) {
        const exists = await ShiftMaster.findOne({ 
          shiftName: { $regex: new RegExp(`^${req.body.shiftName}$`, 'i') } 
        });
        if (exists) {
          return res.status(400).json({ message: 'Shift Name already exists' });
        }
      }
      
      Object.assign(shiftMaster, req.body);
      const updatedShiftMaster = await shiftMaster.save();
      res.json(updatedShiftMaster);
    } else {
      res.status(404).json({ message: 'Shift Master not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete shift master
// @route   DELETE /api/shift-masters/:id
const deleteShiftMaster = async (req, res) => {
  try {
    const shiftMaster = await ShiftMaster.findByIdAndDelete(req.params.id);
    if (shiftMaster) {
      res.json({ message: 'Shift Master removed' });
    } else {
      res.status(404).json({ message: 'Shift Master not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createShiftMaster, getShiftMasters, updateShiftMaster, deleteShiftMaster };
