const mongoose = require('mongoose');

const specifiedMessageSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    body: {
      type: String,
      required: [true, 'Message body is required']
    },
    sendToClass: {
      type: String, // Optional filter that was used
      default: null
    },
    recipients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Reference to students sent to
        required: true
      }
    ],
    attachment: {
      type: String, // URL of the uploaded file
      default: null
    },
    originalFileName: {
      type: String,
      default: null
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const SpecifiedMessage = mongoose.model('SpecifiedMessage', specifiedMessageSchema);
module.exports = SpecifiedMessage;
