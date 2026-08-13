const Sms = require('../models/smsModel');
const SmsTemplate = require('../models/smsTemplateModel');

// ========================
// SMS Management
// ========================

// @desc    Send a new SMS
// @route   POST /api/sms
// @access  Private (Admin)
const sendSms = async (req, res) => {
  try {
    const { subject, language, message, sendCopy, sendTo } = req.body;
    
    // In a real application, you would integrate with an SMS gateway like Twilio here.
    // e.g., sendSmsViaGateway(sendTo, message);

    const sms = new Sms({
      subject,
      language,
      message,
      sendCopy,
      sendTo,
      createdBy: req.user?._id
    });

    const saved = await sms.save();
    res.status(201).json({ message: 'SMS sent successfully', data: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all SMS logs
// @route   GET /api/sms
// @access  Private (Admin)
const getAllSms = async (req, res) => {
  try {
    const filter = {};
    if (req.query.search) {
      filter.subject = { $regex: req.query.search, $options: 'i' };
    }
    if (req.query.sendTo) {
      filter.sendTo = req.query.sendTo;
    }
    
    const smsLogs = await Sms.find(filter).sort({ createdAt: -1 });
    res.json(smsLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get SMS by ID
// @route   GET /api/sms/:id
// @access  Private (Admin)
const getSmsById = async (req, res) => {
  try {
    const sms = await Sms.findById(req.params.id);
    if (!sms) return res.status(404).json({ message: 'SMS not found' });
    res.json(sms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete SMS log
// @route   DELETE /api/sms/:id
// @access  Private (Admin)
const deleteSms = async (req, res) => {
  try {
    const sms = await Sms.findByIdAndDelete(req.params.id);
    if (!sms) return res.status(404).json({ message: 'SMS not found' });
    res.json({ message: 'SMS log deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================
// SMS Templates Management
// ========================

// @desc    Create a new SMS template
// @route   POST /api/sms/templates
// @access  Private (Admin)
const createTemplate = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const template = new SmsTemplate({ subject, message });
    const saved = await template.save();
    res.status(201).json({ message: 'SMS template created successfully', data: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all SMS templates
// @route   GET /api/sms/templates
// @access  Private
const getTemplates = async (req, res) => {
  try {
    const filter = {};
    if (req.query.subject) {
      filter.subject = req.query.subject;
    }
    const templates = await SmsTemplate.find(filter).sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an SMS template
// @route   PUT /api/sms/templates/:id
// @access  Private (Admin)
const updateTemplate = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const template = await SmsTemplate.findByIdAndUpdate(
      req.params.id,
      { subject, message },
      { new: true, runValidators: true }
    );
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json({ message: 'SMS template updated successfully', data: template });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an SMS template
// @route   DELETE /api/sms/templates/:id
// @access  Private (Admin)
const deleteTemplate = async (req, res) => {
  try {
    const template = await SmsTemplate.findByIdAndDelete(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json({ message: 'SMS template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendSms,
  getAllSms,
  getSmsById,
  deleteSms,
  createTemplate,
  getTemplates,
  updateTemplate,
  deleteTemplate
};
