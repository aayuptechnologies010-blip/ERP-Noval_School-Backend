const mongoose = require('mongoose');

const mailTemplateSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'E-Mail Type is required'],
    trim: true
  },
  emailContent: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MailTemplate', mailTemplateSchema);
