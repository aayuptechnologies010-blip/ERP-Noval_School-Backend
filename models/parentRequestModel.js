const mongoose = require('mongoose');

const parentRequestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  studentName: { type: String, required: true },
  admissionNo: { type: String, required: true },
  class: { type: String, default: 'I' },
  section: { type: String, default: 'A' },
  fatherName: { type: String },
  motherName: { type: String },
  mobile: { type: String },
  requestType: { type: String, required: true }, // 'Address Change', 'Contact Number', 'Blood Group', etc.
  currentValue: { type: String },
  requestedValue: { type: String, required: true },
  reason: { type: String },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },
  requestedDate: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

module.exports = mongoose.model('ParentRequest', parentRequestSchema);
