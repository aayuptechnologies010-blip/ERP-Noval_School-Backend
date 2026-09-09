const GlobalPayrollSetting = require('../models/globalPayrollSettingModel');

// @desc    Get global payroll settings
// @route   GET /api/global-payroll-settings
// @access  Private
const getSettings = async (req, res) => {
  try {
    let settings = await GlobalPayrollSetting.findOne({});
    if (!settings) {
      settings = await GlobalPayrollSetting.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update global payroll settings
// @route   PUT /api/global-payroll-settings
// @access  Private
const updateSettings = async (req, res) => {
  try {
    let settings = await GlobalPayrollSetting.findOne({});
    if (!settings) {
      settings = await GlobalPayrollSetting.create(req.body);
    } else {
      settings = await GlobalPayrollSetting.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
