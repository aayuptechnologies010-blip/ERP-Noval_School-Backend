const mongoose = require('mongoose');

const schoolGlobalFeeTypeSchema = new mongoose.Schema({
  feeType: { type: String, required: [true, 'Fee type is required'], trim: true },
  schoolName: { type: String, required: [true, 'School name is required'], trim: true },
  schoolAddress: { type: String, trim: true },
  schoolAddress2: { type: String, trim: true },
  schoolShortName: { type: String, trim: true },
  contactNo: { type: String, trim: true },
  mobile: { type: String, trim: true },
  email: { type: String, trim: true },
  supportEmailId: { type: String, trim: true },
  website: { type: String, trim: true },
  prefix: { type: String, trim: true },
  receiptSettings: { type: String, trim: true },
  schoolNo: { type: String, trim: true },
  affiliationTo: { type: String, trim: true },
  affiliationNo: { type: String, trim: true },
  associates: { type: String, trim: true },
  renewUpto: { type: String, trim: true },
  schoolStatus: { type: String, trim: true },
  city: { type: String, trim: true },
  eCareMobileNo: { type: String, trim: true },
  workingDays: { type: String, trim: true },
  recess: { type: String, trim: true },
  totalPeriod: { type: String, trim: true },
  isAdmin: { type: Boolean, default: false }
}, {
  timestamps: true
});

const SchoolGlobalFeeType = mongoose.model('SchoolGlobalFeeType', schoolGlobalFeeTypeSchema);

module.exports = SchoolGlobalFeeType;
