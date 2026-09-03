const mongoose = require('mongoose');

const admissionSettingSchema = new mongoose.Schema({
  defaultSession: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear' },
  defaultPaymode: { type: String, trim: true },
  amountOnFormEntry: { type: Number, default: 0 },
  
  isValidateStationaryOnProspectusEntry: { type: Boolean, default: false },
  sendSmsAfterEnquiry: { type: Boolean, default: false },
  sendSmsAfterAdmissionFormRegistration: { type: Boolean, default: false },
  
  sendSmsAfterProspectus: { type: Boolean, default: false },
  isAutoRollNo: { type: Boolean, default: false },
  generateTcBoardWise: { type: Boolean, default: false },
  
  areYouWantToFixSession: { type: Boolean, default: false },
  registrationAndProspectusNoSame: { type: Boolean, default: false },
  registrationAndProspectusReceiptNoSame: { type: Boolean, default: true },
  
  importRegistrationWithProspectus: { type: Boolean, default: true },
  areYouWantPrintOutAfterProspectusEntry: { type: Boolean, default: false },
  areYouWantUpdateAdmNoFromRegistration: { type: Boolean, default: true },
  
  sendCredentialSmsAfterStudentRegistration: { type: Boolean, default: false },
  sendSmsMailAfterStudentRegistration: { 
    type: String, 
    enum: ['SMS', 'MAIL', 'BOTH', 'NONE'], 
    default: 'BOTH' 
  },
  byDefaultGender: { 
    type: String, 
    enum: ['Male', 'Female', 'Other'], 
    default: 'Male' 
  },
  
  areYouWantToCheckDuplicateStudentOnRegistration: { type: Boolean, default: false },
  autoFillStudentHouseInformation: { type: Boolean, default: false },
  checkLibraryBookDefaulterForInactiveStudent: { type: Boolean, default: false },
  usernameAsAdmissionNoAndPasswordAsStudentDob: { type: Boolean, default: false }

}, {
  timestamps: true
});

const AdmissionSetting = mongoose.model('AdmissionSetting', admissionSettingSchema);

module.exports = AdmissionSetting;
