const mongoose = require('mongoose');

const salaryAccountSchema = new mongoose.Schema({
  accountName: {
    type: String,
    required: [true, 'Account Name is required'],
    trim: true
  },
  bank: {
    type: String,
    required: [true, 'Bank name is required'],
    trim: true
  },
  accountNo: {
    type: String,
    required: [true, 'Account number is required'],
    trim: true
  },
  branch: {
    type: String,
    default: ''
  },
  ifscCode: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SalaryAccount', salaryAccountSchema);
