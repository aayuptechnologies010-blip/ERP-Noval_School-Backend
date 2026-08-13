const mongoose = require('mongoose');

const smsSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'SMS Subject is required'],
      trim: true
    },
    language: {
      type: String,
      default: 'ENGLISH',
      trim: true
    },
    message: {
      type: String,
      required: [true, 'SMS message body is required'],
      maxlength: [918, 'Message cannot exceed 918 characters']
    },
    sendCopy: {
      type: Boolean,
      default: false
    },
    sendTo: {
      type: String,
      required: [true, 'Send To is required']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Sms = mongoose.model('Sms', smsSchema);
module.exports = Sms;
