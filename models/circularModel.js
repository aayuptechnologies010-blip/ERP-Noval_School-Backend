const mongoose = require('mongoose');

const circularSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Circular title is required'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Date is required']
    },
    details: {
      type: String,
      trim: true
    },
    sendTo: {
      type: String,
      required: [true, 'Send to field is required'],
      enum: ['All User', 'Student', 'Staff', 'Parent', 'Admin'],
      default: 'All User'
    },
    fileUrl: {
      type: String,
      default: null
    },
    mustRead: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    session: {
      type: String,
      trim: true
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

const Circular = mongoose.model('Circular', circularSchema);
module.exports = Circular;
