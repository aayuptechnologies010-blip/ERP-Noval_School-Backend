const mongoose = require('mongoose');

const classNoticeSchema = new mongoose.Schema(
  {
    class: {
      type: String,
      required: [true, 'Class is required'],
      trim: true
    },
    section: {
      type: String,
      default: null,
      trim: true
    },
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

const ClassNotice = mongoose.model('ClassNotice', classNoticeSchema);
module.exports = ClassNotice;
