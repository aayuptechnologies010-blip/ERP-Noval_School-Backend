const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  studentName: { type: String, required: true },
  admissionNo: { type: String },
  fatherName: { type: String },
  class: { type: String },
  points: { type: Number, default: 0 },
  criteriaPoints: { type: Map, of: Number, default: {} },
  status: { type: String, default: 'Allotted' }
});

const admissionSlotSchema = new mongoose.Schema({
  slotName: { type: String, required: true },
  session: { type: String, default: '2026-2027' },
  class: { type: String, default: 'All' },
  slotDate: { type: String, required: true },
  startTime: { type: String, default: '09:00 AM' },
  endTime: { type: String, default: '11:00 AM' },
  maxApplicants: { type: Number, default: 25 },
  allottedApplicants: { type: Number, default: 0 },
  location: { type: String, default: 'Room 101 - Main Wing' },
  status: { type: String, default: 'Active' },
  applicants: [applicantSchema]
}, { timestamps: true });

module.exports = mongoose.model('AdmissionSlot', admissionSlotSchema);
