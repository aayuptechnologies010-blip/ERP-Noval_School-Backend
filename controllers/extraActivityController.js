const ExtraActivity = require('../models/extraActivityModel');

// @desc    Create a new extra activity
// @route   POST /api/extra-activities
// @access  Private
const createExtraActivity = async (req, res) => {
  try {
    const { activityName } = req.body;

    if (!activityName) {
      return res.status(400).json({ message: 'Activity name is required' });
    }

    const exists = await ExtraActivity.findOne({ activityName: { $regex: new RegExp(`^${activityName}$`, 'i') } });

    if (exists) {
      return res.status(400).json({ message: 'Activity already exists' });
    }

    const activity = await ExtraActivity.create({
      activityName
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all extra activities
// @route   GET /api/extra-activities
// @access  Private
const getExtraActivities = async (req, res) => {
  try {
    const activities = await ExtraActivity.find({}).sort({ createdAt: -1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get extra activity by ID
// @route   GET /api/extra-activities/:id
// @access  Private
const getExtraActivityById = async (req, res) => {
  try {
    const activity = await ExtraActivity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an extra activity
// @route   PUT /api/extra-activities/:id
// @access  Private
const updateExtraActivity = async (req, res) => {
  try {
    const { activityName, isActive } = req.body;
    const activity = await ExtraActivity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    if (activityName && activityName.toLowerCase() !== activity.activityName.toLowerCase()) {
      const exists = await ExtraActivity.findOne({ activityName: { $regex: new RegExp(`^${activityName}$`, 'i') } });
      if (exists) {
        return res.status(400).json({ message: 'Activity name already in use' });
      }
    }

    if (activityName) activity.activityName = activityName;
    if (isActive !== undefined) activity.isActive = isActive;

    const updatedActivity = await activity.save();
    res.status(200).json(updatedActivity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an extra activity
// @route   DELETE /api/extra-activities/:id
// @access  Private
const deleteExtraActivity = async (req, res) => {
  try {
    const activity = await ExtraActivity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    await activity.deleteOne();
    res.status(200).json({ message: 'Activity removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createExtraActivity,
  getExtraActivities,
  getExtraActivityById,
  updateExtraActivity,
  deleteExtraActivity
};
