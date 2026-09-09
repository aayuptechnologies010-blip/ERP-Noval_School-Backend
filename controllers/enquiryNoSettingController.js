const EnquiryNoSetting = require('../models/enquiryNoSettingModel');

// @desc    Get enquiry no setting
// @route   GET /api/enquiry-no-settings
// @access  Private
const getSetting = async (req, res) => {
  try {
    let setting = await EnquiryNoSetting.findOne();
    if (!setting) {
      setting = await EnquiryNoSetting.create({});
    }
    res.status(200).json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update enquiry no setting
// @route   PUT /api/enquiry-no-settings
// @access  Private
const updateSetting = async (req, res) => {
  try {
    let setting = await EnquiryNoSetting.findOne();
    if (!setting) {
      setting = new EnquiryNoSetting(req.body);
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
