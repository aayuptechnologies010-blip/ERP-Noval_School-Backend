const mongoose = require('mongoose');

const itHeadGroupSchema = new mongoose.Schema({
  groupSlNo: {
    type: Number,
    default: 1
  },
  groupName: {
    type: String,
    required: true,
    trim: true
  },
  maxRebateLimit: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 100.00
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

module.exports = mongoose.model('ITHeadGroup', itHeadGroupSchema);
