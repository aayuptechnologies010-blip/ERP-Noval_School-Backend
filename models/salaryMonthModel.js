const mongoose = require('mongoose');

const salaryMonthSchema = new mongoose.Schema({
  orderNo: {
    type: Number,
    required: [true, 'Order No is required']
  },
  month: {
    type: String,
    required: [true, 'Month is required'],
    trim: true
  },
  year: {
    type: String,
    required: [true, 'Year is required'],
    trim: true
  },
  workingDays: {
    type: Number,
    required: [true, 'Working Days is required'],
    default: 26
  },
  totalDays: {
    type: Number,
    required: [true, 'Total Days is required'],
    default: 30
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SalaryMonth', salaryMonthSchema);
