const mongoose = require('mongoose');

const meritListApplicantSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  admissionNo: { type: String, required: true },
  studentName: { type: String, required: true },
  fatherName: { type: String },
  class: { type: String },
  totalPoints: { type: Number, default: 0 },
  rank: { type: Number },
  status: { type: String, default: 'Selected' } // Selected, Waiting, Rejected
});

const meritListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  session: { type: String, default: '2026-2027' },
  class: { type: String, default: 'All' },
  fromDate: { type: String, default: '01-Sep-2026' },
  toDate: { type: String, default: '20-Sep-2026' },
  minPoint: { type: Number, default: 50 },
  applicantLimit: { type: Number, default: 30 },
  applicant: { type: Number, default: 0 },
  allotted: { type: Number, default: 0 },
  status: { type: String, default: 'Active' },
  applicants: [meritListApplicantSchema]
}, { timestamps: true });

module.exports = mongoose.model('MeritList', meritListSchema);
