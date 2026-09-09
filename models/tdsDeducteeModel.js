const mongoose = require('mongoose');

const tdsDeducteeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  fatherName: {
    type: String,
    default: '',
    trim: true
  },
  designation: {
    type: String,
    default: '',
    trim: true
  },
  place: {
    type: String,
    default: '',
    trim: true
  },
  pan: {
    type: String,
    default: '',
    trim: true
  },
  tan: {
    type: String,
    default: '',
    trim: true
  },
  isPrimary: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('TDSDeductee', tdsDeducteeSchema);
