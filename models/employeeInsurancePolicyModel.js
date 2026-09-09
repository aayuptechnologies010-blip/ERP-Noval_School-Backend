const mongoose = require('mongoose');

const employeeInsurancePolicySchema = new mongoose.Schema({
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
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InsuranceVendor'
  },
  vendorName: {
    type: String,
    required: true,
    trim: true
  },
  policyNo: {
    type: String,
    required: [true, 'Policy number is required'],
    trim: true
  },
  policyName: {
    type: String,
    default: '',
    trim: true
  },
  premiumAmount: {
    type: Number,
    required: [true, 'Premium amount is required'],
    default: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  maturityDate: {
    type: Date
  },
  frequency: {
    type: String,
    enum: ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'],
    default: 'Monthly'
  },
  status: {
    type: String,
    enum: ['Active', 'Matured', 'Surrendered', 'Inactive'],
    default: 'Active'
  },
  remarks: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('EmployeeInsurancePolicy', employeeInsurancePolicySchema);
