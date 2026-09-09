const mongoose = require('mongoose');

const itHeadSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ITHeadGroup'
  },
  groupName: {
    type: String,
    required: true,
    trim: true
  },
  slNo: {
    type: Number,
    default: 1
  },
  headName: {
    type: String,
    required: true,
    trim: true
  },
  reportName: {
    type: String,
    default: '',
    trim: true
  },
  maxRebateLimit: {
    type: Number,
    default: 0
  },
  modifyDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ITHead', itHeadSchema);
