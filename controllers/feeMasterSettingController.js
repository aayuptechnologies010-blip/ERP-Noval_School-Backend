const FeeMasterSetting = require('../models/feeMasterSettingModel');

// @desc    Get a setting by its unique key
// @route   GET /api/fee-master-settings/:key
// @access  Private
const getSettingByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await FeeMasterSetting.findOne({ settingKey: key });
    
    if (!setting) {
      // Return 200 with null or empty object so the frontend knows it hasn't been set yet
      return res.status(200).json(null);
    }

    res.status(200).json(setting.settingValue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update a setting by its unique key
// @route   POST /api/fee-master-settings/:key
// @access  Private
const updateSettingByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const settingValue = req.body;

    if (!settingValue || Object.keys(settingValue).length === 0) {
      return res.status(400).json({ message: 'Setting value cannot be empty' });
    }

    const updatedSetting = await FeeMasterSetting.findOneAndUpdate(
      { settingKey: key },
      { settingValue },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      message: `${key} saved successfully`,
      data: updatedSetting.settingValue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettingByKey,
  updateSettingByKey
};
