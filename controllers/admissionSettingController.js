const AdmissionSetting = require('../models/admissionSettingModel');

// @desc    Get admission setting
// @route   GET /api/admission-settings
// @access  Private
const getSetting = async (req, res) => {
  try {
    let setting = await AdmissionSetting.findOne();
    if (!setting) {
      setting = await AdmissionSetting.create({});
    }
    res.status(200).json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update admission setting
// @route   PUT /api/admission-settings
// @access  Private
const updateSetting = async (req, res) => {
  try {
    let setting = await AdmissionSetting.findOne();
    if (!setting) {
      setting = new AdmissionSetting(req.body);
    } else {
      Object.assign(setting, req.body);
    }
    
    const updatedSetting = await setting.save();
    res.status(200).json(updatedSetting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSetting,
  updateSetting
};
