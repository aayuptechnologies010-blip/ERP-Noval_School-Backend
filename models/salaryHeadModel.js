const mongoose = require('mongoose');

const salaryHeadSchema = new mongoose.Schema({
  serial: {
    type: Number,
    required: [true, 'Head Serial No is required']
  },
  head: {
    type: String,
    required: [true, 'Head name is required'],
    trim: true
  },
  report: {
    type: String,
    required: [true, 'Head report name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Allowance', 'Deduction'],
    default: 'Allowance'
  },
  lwp: {
    type: Boolean,
    default: false
  },
  ot: {
    type: Boolean,
    default: false
  },
  vType: {
    type: String,
    default: 'Fixed'
  },
  show: {
    type: Boolean,
    default: true
  },
  val: {
    type: String,
    default: '0.00'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SalaryHead', salaryHeadSchema);
