const mongoose = require('mongoose');

const fixationSchema = new mongoose.Schema({
  scale: {
    type: String,
    required: true,
    trim: true
  },
  basicPercent: {
    type: Number,
    default: 50.00
  },
  daPercent: {
    type: Number,
    default: 21.00
  },
  gradePay: {
    type: Number,
    default: 2400.00
  },
  payScaleAmount: {
    type: Number,
    default: 5300.00
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

module.exports = mongoose.model('Fixation', fixationSchema);
