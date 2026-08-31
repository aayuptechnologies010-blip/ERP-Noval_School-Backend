const mongoose = require('mongoose');

const schoolGlobalDetailsSchema = new mongoose.Schema({
  schoolName: { type: String, required: [true, 'School name is required'], trim: true },
  schoolAddress: { type: String, trim: true },
  schoolAddress2: { type: String, trim: true },
  schoolShortName: { type: String, trim: true },
  contactNo: { type: String, trim: true },
  mobile: { type: String, trim: true },
  secondaryContactNo: { type: String, trim: true },
  emailId: { type: String, trim: true },
  supportEmailId: { type: String, trim: true },
  website: { type: String, trim: true },
  prefix: { type: String, trim: true },
  isoDetails: { type: String, trim: true },
  establishmentCode: { type: String, trim: true },
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
  schoolCategory: { type: String, trim: true },
  uDiseRegistrationNo: { type: String, trim: true },
  facebookId: { type: String, trim: true },
  supportTime: { type: String, trim: true },
  supportDays: { type: String, trim: true },
  isMainSchool: { type: Boolean, default: false }
}, {
  timestamps: true
});

const SchoolGlobalDetails = mongoose.model('SchoolGlobalDetails', schoolGlobalDetailsSchema);

module.exports = SchoolGlobalDetails;
