const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: [true, 'Sender is required']
    },
    recipients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'At least one recipient is required']
      }
    ],
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      maxlength: [150, 'Subject cannot be more than 150 characters'],
      trim: true
    },
    body: {
      type: String,
      required: [true, 'Message body is required']
    },
    attachment: {
      type: String, // URL to the uploaded file
      default: null
    },
    originalFileName: {
      type: String,
      default: null
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
