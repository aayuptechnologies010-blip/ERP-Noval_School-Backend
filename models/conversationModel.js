const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true
    },
    sender: {
      type: String,
      required: [true, 'Sender name is required'],
      trim: true
    },
    receiver: {
      type: String,
      required: [true, 'Receiver name is required'],
      trim: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Open', 'Pending Review', 'Resolved'],
      default: 'Open'
    }
  },
  {
    timestamps: true
  }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
