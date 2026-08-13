const mongoose = require('mongoose');

const specifiedSmsSchema = new mongoose.Schema(
  {
    smsType: {
      type: String,
      required: [true, 'SMS Type is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'SMS message is required'],
      maxlength: [918, 'Message cannot exceed 918 characters']
    },
    sendCopy: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      required: [true, 'Date is required']
    },
    recipients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        // Referencing can be dynamic or handled in application logic (Student, Staff, etc.)
      }
    ],
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

const SpecifiedSms = mongoose.model('SpecifiedSms', specifiedSmsSchema);
module.exports = SpecifiedSms;
