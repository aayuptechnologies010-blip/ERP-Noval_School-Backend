const MailTemplate = require('../models/mailTemplateModel');

// @desc    Get all mail templates
// @route   GET /api/mail-templates
const getAllMailTemplates = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { type: { $regex: search, $options: 'i' } },
          { emailContent: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const templates = await MailTemplate.find(query).sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a mail template
// @route   POST /api/mail-templates
const createMailTemplate = async (req, res) => {
  try {
    const { type, emailContent, active } = req.body;
    if (!type) {
      return res.status(400).json({ message: 'E-Mail Type is required' });
    }
    const template = await MailTemplate.create({
      type,
      emailContent: emailContent || '',
      active: active !== undefined ? active : true
    });
    res.status(201).json(template);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A template with this type already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a mail template
// @route   PUT /api/mail-templates/:id
const updateMailTemplate = async (req, res) => {
  try {
    const { type, emailContent, active } = req.body;
    const template = await MailTemplate.findByIdAndUpdate(
      req.params.id,
      { type, emailContent, active },
      { new: true, runValidators: true }
    );
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a mail template
// @route   DELETE /api/mail-templates/:id
const deleteMailTemplate = async (req, res) => {
  try {
    const template = await MailTemplate.findByIdAndDelete(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllMailTemplates,
  createMailTemplate,
  updateMailTemplate,
  deleteMailTemplate
};
