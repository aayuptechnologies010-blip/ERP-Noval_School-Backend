const FeeReceiptSetting = require('../models/feeReceiptSettingModel');

// @desc    Get Fee Receipt Settings
// @route   GET /api/fee-receipt-settings
// @access  Private
const getFeeReceiptSettings = async (req, res) => {
  try {
    let settings = await FeeReceiptSetting.findOne({});
    
    if (!settings) {
      // Return a default structure if none exists
      settings = {
        receiptType: 'Single Receipt',
        settings: [{ prefix: '', leadZero: 0, rcptNoStart: 1, suffix: '' }]
      };
    }
    
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Fee Receipt Settings (Upsert)
// @route   POST /api/fee-receipt-settings
// @access  Private
const updateFeeReceiptSettings = async (req, res) => {
  try {
    const { receiptType, settings } = req.body;

    if (!receiptType || !settings || !Array.isArray(settings)) {
      return res.status(400).json({ message: 'receiptType and a settings array are required' });
    }

    let existingSetting = await FeeReceiptSetting.findOne({});

    if (existingSetting) {
      existingSetting.receiptType = receiptType;
      existingSetting.settings = settings;
      const updated = await existingSetting.save();
      return res.status(200).json(updated);
    } else {
      const newSetting = await FeeReceiptSetting.create({
        receiptType,
        settings
      });
      return res.status(201).json(newSetting);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFeeReceiptSettings,
  updateFeeReceiptSettings
};
