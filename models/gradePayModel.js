const mongoose = require('mongoose');

const gradePaySchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
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

module.exports = mongoose.model('GradePay', gradePaySchema);
