const mongoose = require('mongoose');

const payScaleSchema = new mongoose.Schema({
  scale: {
    type: String,
    required: true,
    trim: true,
    unique: true
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

module.exports = mongoose.model('PayScale', payScaleSchema);
