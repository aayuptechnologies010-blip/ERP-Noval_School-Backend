const mongoose = require('mongoose');

const smsLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Transactional', 'Promotional', 'OTP'],
      default: 'Transactional',
      trim: true
    },
    sentTo: {
      type: String,
      required: [true, 'Recipient is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    count: {
      type: Number,
      default: 1
    },
    creditsUsed: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      enum: ['Delivered', 'Failed', 'Pending'],
      default: 'Delivered'
    },
    module: {
      type: String, // e.g. 'Attendance', 'Fee', 'Circular', 'Manual'
      default: 'Manual'
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    }
  },
  { timestamps: true }
);

const SmsLog = mongoose.model('SmsLog', smsLogSchema);
module.exports = SmsLog;
