const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true
    },
    heading: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      default: 'General'
    },
    noticeDate: {
      type: Date,
      default: Date.now
    },
    activationDate: {
      type: Date,
      default: Date.now
    },
    deactivationDate: {
      type: Date
    },
    attachment: {
      type: String,
      default: ''
    },
    coverImage: {
      type: String,
      default: ''
    },
    showOnWebsite: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: false
    }
  },
  {
    timestamps: true
  }
);

const Notice = mongoose.model('Notice', noticeSchema);
module.exports = Notice;
