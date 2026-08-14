const Activity = require('../models/activityModel');

// @desc    Create a new Activity
// @route   POST /api/activities
// @access  Private
const createActivity = async (req, res) => {
  try {
    const { title, dayType, duration, fromDate, assignTo, isActive, showOnWebsite } = req.body;

    if (!title || !dayType || !duration || !fromDate || !assignTo) {
      return res.status(400).json({
        message: 'title, dayType, duration, fromDate, and assignTo are required.',
      });
    }

    const activity = new Activity({
      title,
      dayType,
      duration,
      fromDate,
      assignTo,
      isActive: isActive || false,
      showOnWebsite: showOnWebsite || false,
    });

    const savedActivity = await activity.save();
    res.status(201).json({ message: 'Activity created successfully', activity: savedActivity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all Activities
// @route   GET /api/activities
// @access  Private
const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: activities.length,
      records: activities,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createActivity,
  getAllActivities,
};
