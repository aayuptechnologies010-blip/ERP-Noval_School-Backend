const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: [true, 'Notice heading is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Notice description is required']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        // Using generic reference since users can be of different types,
        // or just rely on the ID matching the logged-in user.
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

const Notice = mongoose.model('Notice', noticeSchema);
module.exports = Notice;
