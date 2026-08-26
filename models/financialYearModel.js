const mongoose = require('mongoose');

const financialYearSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Financial Year name is required'],
    unique: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const FinancialYear = mongoose.model('FinancialYear', financialYearSchema);

module.exports = FinancialYear;
