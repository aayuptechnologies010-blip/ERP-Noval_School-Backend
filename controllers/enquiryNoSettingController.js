const EnquiryNoSetting = require('../models/enquiryNoSettingModel');

// @desc    Get enquiry no setting by session
// @route   GET /api/enquiry-no-settings/:sessionId
// @access  Private
const getEnquiryNoSetting = async (req, res) => {
  try {
    const { sessionId } = req.params;
    let setting = await EnquiryNoSetting.findOne({ session: sessionId }).populate('session');
    
    if (!setting) {
      // Create a default if it doesn't exist for the session
      setting = await EnquiryNoSetting.create({ session: sessionId });
      // Re-fetch to populate
      setting = await EnquiryNoSetting.findById(setting._id).populate('session');
    }

    res.status(200).json(setting);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update enquiry no setting
// @route   PUT /api/enquiry-no-settings/:sessionId
// @access  Private
const updateEnquiryNoSetting = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const updateData = req.body;

    // Prevent changing the session reference via update
    if (updateData.session) {
      delete updateData.session;
    }

    const updatedSetting = await EnquiryNoSetting.findOneAndUpdate(
      { session: sessionId },
      { $set: updateData },
      { new: true, runValidators: true, upsert: true }
    ).populate('session');

    res.status(200).json(updatedSetting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEnquiryNoSetting,
  updateEnquiryNoSetting
};
