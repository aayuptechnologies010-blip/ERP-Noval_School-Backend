const mongoose = require('mongoose');

const smsTemplateSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Template subject is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Template message is required']
    },
    templateId: { type: String },
    smsEnable: { type: Boolean, default: false },
    isUnicode: { type: Boolean, default: false },
    pushNotificationEnable: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

const SmsTemplate = mongoose.model('SmsTemplate', smsTemplateSchema);
module.exports = SmsTemplate;
