const mongoose = require('mongoose');

const schema = mongoose.Schema({
  enquiryNo: { type: String },
  class: { type: String },
  board: { type: String },
  regNo: { type: String },
  date: { type: String },
  session: { type: String },
  studentName: { type: String },
  middleName: { type: String },
  lastName: { type: String },
  reference: { type: String },
  dob: { type: String },
  gender: { type: String },
  fatherName: { type: String },
  fatherMiddleName: { type: String },
  fatherLastName: { type: String },
  contactMobile: { type: String },
  motherName: { type: String },
  motherMiddleName: { type: String },
  motherLastName: { type: String },
  contactPerson: { type: String },
  contactEmail: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  remark: { type: String },
  admissionTestDate: { type: String },
  admissionTestTime: { type: String },
  interactionDate: { type: String },
  interactionTime: { type: String },
  paymode: { type: String },
  isOnline: { type: Boolean, default: false },
  amount: { type: String, default: '0.00' }
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Prospectus', schema);