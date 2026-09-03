const AdmissionSetting = require('../models/admissionSettingModel');

// @desc    Get admission settings
// @route   GET /api/admission-settings
// @access  Private
const getAdmissionSettings = async (req, res) => {
  try {
    let settings = await AdmissionSetting.findOne().populate('defaultSession');
    
    // If no settings exist yet, create default settings
    if (!settings) {
      settings = await AdmissionSetting.create({});
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update admission settings
// @route   PUT /api/admission-settings
// @access  Private
const updateAdmissionSettings = async (req, res) => {
  try {
    let settings = await AdmissionSetting.findOne();

    if (!settings) {
      settings = await AdmissionSetting.create({});
    }

    // Update dynamically based on whatever is sent in the body
    const updates = Object.keys(req.body);
    updates.forEach((update) => {
      settings[update] = req.body[update];
    });

    const updatedSettings = await settings.save();
    res.status(200).json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdmissionSettings,
  updateAdmissionSettings
};
