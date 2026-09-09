const Holiday = require('../models/holidayModel');

// @desc    Create new holiday
// @route   POST /api/holidays
const createHoliday = async (req, res) => {
  try {
    const { holidayName, department, fromDate, toDate } = req.body;
    
    // Check duplicate
    const exists = await Holiday.findOne({ 
      holidayName: { $regex: new RegExp(`^${holidayName}$`, 'i') } 
    });
    
    if (exists) {
      return res.status(400).json({ message: 'Holiday name already exists' });
    }

    const holiday = await Holiday.create({
      holidayName, department, fromDate, toDate
    });

    res.status(201).json(holiday);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all holidays
// @route   GET /api/holidays
const getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find({});
    res.json(holidays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update holiday
// @route   PUT /api/holidays/:id
const updateHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.findById(req.params.id);
    
    if (holiday) {
      if (req.body.holidayName && req.body.holidayName.toLowerCase() !== holiday.holidayName.toLowerCase()) {
        const exists = await Holiday.findOne({ 
          holidayName: { $regex: new RegExp(`^${req.body.holidayName}$`, 'i') } 
        });
        if (exists) {
          return res.status(400).json({ message: 'Holiday name already exists' });
        }
      }
      
      holiday.holidayName = req.body.holidayName || holiday.holidayName;
      holiday.department = req.body.department || holiday.department;
      holiday.fromDate = req.body.fromDate || holiday.fromDate;
      holiday.toDate = req.body.toDate || holiday.toDate;

      const updatedHoliday = await holiday.save();
      res.json(updatedHoliday);
    } else {
      res.status(404).json({ message: 'Holiday not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete holiday
// @route   DELETE /api/holidays/:id
const deleteHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.findByIdAndDelete(req.params.id);
    if (holiday) {
      res.json({ message: 'Holiday removed' });
    } else {
      res.status(404).json({ message: 'Holiday not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createHoliday, getHolidays, updateHoliday, deleteHoliday };
