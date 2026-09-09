const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  enquiryNo: { type: String, unique: true },
  session: { type: String },
  enquiryDate: { type: Date, default: Date.now },
  guardianName: { type: String },
  guardianAddress: { type: String },
  contactNo: { type: String, required: true },
  contactPerson: { type: String },
  reference: { type: String },
  studentName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String },
  dob: { type: Date },
  gender: { type: String },
  classInterested: { type: String },
  category: { type: String },
  caste: { type: String },
  feePaid: { type: Boolean, default: false },
  feeAmount: { type: Number },
  status: {
    type: String,
    enum: ['Pending', 'Follow-up', 'Converted', 'Dropped'],
    default: 'Pending'
  },
  followUpDate: { type: Date },
  remarks: { type: String }
}, {
  timestamps: true
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);
module.exports = Inquiry;
