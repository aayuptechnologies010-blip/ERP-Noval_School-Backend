const mongoose = require('mongoose');

const admissionFormSchema = new mongoose.Schema({
  prospectusType: { type: String, default: 'Without Prospectus/Enquiry' },
  searchProsEnq: { type: String },
  class: { type: String },
  session: { type: String },
  board: { type: String },
  regNo: { type: String },
  prosNo: { type: String },
  enqNo: { type: String },
  date: { type: String },
  amount: { type: String, default: '200.00' },
  admissionAccount: { type: String },
  postAccount: { type: String },
  paymentMode: { type: String },

  // Student Details
  firstName: { type: String },
  middleName: { type: String },
  lastName: { type: String },
  dob: { type: String },
  placeOfBirth: { type: String },
  doj: { type: String },
  gender: { type: String, default: 'Male' },
  email: { type: String },
  mobile: { type: String },
  aadharNo: { type: String },
  studentNameAadhar: { type: String },
  bloodGroup: { type: String },

  // Contacts
  contactPersonName: { type: String },
  contactPersonEmail: { type: String },
  contactPersonMobile: { type: String },
  secondaryContactNo: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pinCode: { type: String },

  // Other Details
  religion: { type: String },
  caste: { type: String },
  category: { type: String },
  isEws: { type: String, default: 'No' },
  sibling: { type: String, default: 'No' },
  transport: { type: String, default: 'NA' },
  nationality: { type: String, default: 'Indian' },
  udiseNo: { type: String },
  pen: { type: String },
  isMinority: { type: Boolean, default: false },

  status: { type: String, default: 'Submitted' }
}, { timestamps: true, strict: false });

module.exports = mongoose.model('AdmissionForm', admissionFormSchema);
