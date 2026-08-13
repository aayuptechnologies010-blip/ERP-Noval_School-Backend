const mongoose = require('mongoose');

const staffNoticeSchema = new mongoose.Schema(
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

const StaffNotice = mongoose.model('StaffNotice', staffNoticeSchema);
module.exports = StaffNotice;
