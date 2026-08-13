const SpecifiedSms = require('../models/specifiedSmsModel');

// @desc    Send a specified SMS
// @route   POST /api/specified-sms
// @access  Private (Admin)
const sendSpecifiedSms = async (req, res) => {
  try {
    const { smsType, message, sendCopy, date, recipients } = req.body;
    
    // In a real application, you would trigger the SMS gateway API for each recipient here.

    const specifiedSms = new SpecifiedSms({
      smsType,
      message,
      sendCopy,
      date,
      recipients,
      createdBy: req.user?._id
    });

    const saved = await specifiedSms.save();
    res.status(201).json({ message: 'Specified SMS sent successfully', data: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all specified SMS logs
// @route   GET /api/specified-sms
// @access  Private (Admin)
const getAllSpecifiedSms = async (req, res) => {
  try {
    const filter = {};
    if (req.query.smsType) {
      filter.smsType = req.query.smsType;
    }
    
    const smsLogs = await SpecifiedSms.find(filter).sort({ createdAt: -1 });
    res.json(smsLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get specified SMS by ID
// @route   GET /api/specified-sms/:id
// @access  Private (Admin)
const getSpecifiedSmsById = async (req, res) => {
  try {
    const sms = await SpecifiedSms.findById(req.params.id);
    if (!sms) return res.status(404).json({ message: 'Specified SMS not found' });
    res.json(sms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete specified SMS log
// @route   DELETE /api/specified-sms/:id
// @access  Private (Admin)
const deleteSpecifiedSms = async (req, res) => {
  try {
    const sms = await SpecifiedSms.findByIdAndDelete(req.params.id);
    if (!sms) return res.status(404).json({ message: 'Specified SMS not found' });
    res.json({ message: 'Specified SMS deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendSpecifiedSms,
  getAllSpecifiedSms,
  getSpecifiedSmsById,
  deleteSpecifiedSms
};
