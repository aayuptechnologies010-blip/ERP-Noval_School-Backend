const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  enquiryNo: {
    type: String,
    required: true,
    unique: true
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear'
  },
  enquiryDate: {
    type: Date,
    required: true
  },
  guardianName: { type: String },
  guardianAddress: { type: String },
  contactNo: { type: String },
  contactPerson: { type: String },
  referenceRemark: { type: String },
  
  studentName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String },
  dob: { type: Date },
  admissionInClass: { type: String },
  studentAddress: { type: String },
  lastSchool: { type: String },
  reasonForLeaving: { type: String },
  
  fatherName: { type: String },
  fatherMiddleName: { type: String },
  fatherLastName: { type: String },
  fatherMobile: { type: String },
  fatherEmail: { type: String },
  
  motherName: { type: String },
  motherMiddleName: { type: String },
  motherLastName: { type: String },
  motherMobile: { type: String },
  motherEmail: { type: String },
  
  howDidYouKnow: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  
  // Follow-up related fields
  enquiryStatus: { type: String, default: 'Pending' },
  counsellor: { type: String },
  enquiryType: { type: String },
  nextFollowUpDate: { type: Date },
  lastRemark: { type: String },
  followUps: [{
    followUpDate: Date,
    remark: String,
    counsellor: String,
    enquiryType: String,
    enquiryStatus: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);

module.exports = Enquiry;
