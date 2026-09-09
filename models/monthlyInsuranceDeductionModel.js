const mongoose = require('mongoose');

const monthlyInsuranceDeductionSchema = new mongoose.Schema({
  monthYear: {
    type: String,
    required: [true, 'Month-Year is required'],
    trim: true
  },
  month: {
    type: String,
    default: '',
    trim: true
  },
  year: {
    type: String,
    default: '',
    trim: true
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  staffName: {
    type: String,
    required: true,
    trim: true
  },
  empNo: {
    type: String,
    default: '',
    trim: true
  },
  policyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmployeeInsurancePolicy'
  },
  policyNo: {
    type: String,
    required: true,
    trim: true
  },
  policyName: {
    type: String,
    default: '',
    trim: true
  },
  vendorName: {
    type: String,
    required: true,
    trim: true
  },
  premiumAmount: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Processed', 'Skipped'],
    default: 'Scheduled'
  },
  remarks: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MonthlyInsuranceDeduction', monthlyInsuranceDeductionSchema);
