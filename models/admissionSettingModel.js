const mongoose = require('mongoose');

const admissionSettingSchema = new mongoose.Schema({
  defaultSession: { type: String, default: '' },
  defaultPaymode: { type: String, default: '' },
  amountOnFormEntry: { type: String, default: '' },
  isValidateStationary: { type: Boolean, default: false },
  sendSmsAfterEnquiry: { type: Boolean, default: false },
  sendSmsAfterAdmission: { type: Boolean, default: false },
  sendSmsAfterProspectus: { type: Boolean, default: false },
  isAutoRollNo: { type: Boolean, default: false },
  generateTcBoardWise: { type: Boolean, default: false },
  fixSession: { type: Boolean, default: false },
  registrationProspectusNoSame: { type: Boolean, default: false },
  registrationProspectusReceiptNoSame: { type: Boolean, default: false },
  importRegistrationWithProspectus: { type: Boolean, default: false },
  printOutAfterProspectus: { type: Boolean, default: false },
  updateAdmNoFromRegistration: { type: Boolean, default: false },
  sendCredentialSms: { type: Boolean, default: false },
  sendSmsMailAfterRegistration: { type: String, enum: ['BOTH', 'SMS', 'MAIL', ''], default: 'BOTH' },
  defaultGender: { type: String, enum: ['Male', 'Female', ''], default: 'Male' },
  autoFillHouseInfo: { type: Boolean, default: false },
  checkLibraryDefaulter: { type: Boolean, default: false },
  checkDuplicateStudent: { type: Boolean, default: false },
  usernameAdmissionPasswordDob: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('AdmissionSetting', admissionSettingSchema);
