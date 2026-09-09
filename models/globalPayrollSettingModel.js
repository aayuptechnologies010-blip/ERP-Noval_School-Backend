const mongoose = require('mongoose');

const globalPayrollSettingSchema = new mongoose.Schema({
  // Global Settings - Main
  rebateOnTaFor12Months: { type: Boolean, default: true },
  rebateOnTaAmount: { type: Number, default: 0 },
  hraMetroPercent: { type: Number, default: 40.00 },
  hraNonMetroPercent: { type: Number, default: 50.00 },
  rebateOnHillAllowance: { type: Number, default: 0 },
  
  // Salary Calculation Based On
  salaryCalcBase: { type: String, enum: ['monthly_gross', 'monthly_basic'], default: 'monthly_gross' },
  
  // Report Settings (Headers, Signatures, Formats)
  reportSettings: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('GlobalPayrollSetting', globalPayrollSettingSchema);
