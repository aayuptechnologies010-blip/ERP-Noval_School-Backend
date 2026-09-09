const mongoose = require('mongoose');

const leaveTypeSchema = mongoose.Schema({
  leaveName: { type: String, required: true },
  leaveAbbr: { type: String, required: true },
  leaveType: { type: String, required: true },
  maxLimit: { type: Number, default: 0 },
  lifetimeServiceMaxLimit: { type: Number, default: 0 },
  payDeductionPerLeave: { type: Number, default: 0 },
  maxAcceptableInMonth: { type: Number, default: 0 },
  maxAcceptableInContinuation: { type: Number, default: 0 },
  applyBeforeDays: { type: Number, default: 0 },
  lateDaysForLwp: { type: Number, default: 0 },
  applyBeforeEmploymentDays: { type: Number, default: 0 },
  
  carryForward: { type: Boolean, default: false },
  prefixSuffixOnly: { type: Boolean, default: false },
  enableUploadFile: { type: Boolean, default: false },
  allowPreviousMonthCL: { type: Boolean, default: false },
  autoAssigning: { type: Boolean, default: false },
  showOnEcare: { type: Boolean, default: true },
}, {
  timestamps: true
});

const LeaveType = mongoose.model('LeaveType', leaveTypeSchema);
module.exports = LeaveType;
