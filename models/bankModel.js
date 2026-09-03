const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: [true, 'Bank name is required'],
    trim: true,
  },
  accountNumber: {
    type: String,
    trim: true,
  },
  mobile: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  ifscCode: {
    type: String,
    trim: true,
  },
  bsrCode: {
    type: String,
    trim: true,
  },
  isSchool: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Bank = mongoose.model('Bank', bankSchema);

module.exports = Bank;
