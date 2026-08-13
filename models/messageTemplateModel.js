const mongoose = require('mongoose');

const messageTemplateSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Template subject is required'],
      trim: true
    },
    body: {
      type: String,
      required: [true, 'Template body is required']
    }
  },
  {
    timestamps: true
  }
);

const MessageTemplate = mongoose.model('MessageTemplate', messageTemplateSchema);
module.exports = MessageTemplate;
