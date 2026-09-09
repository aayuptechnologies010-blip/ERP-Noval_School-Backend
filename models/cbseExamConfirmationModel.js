const mongoose = require('mongoose');

const cbseExamConfirmationSchema = new mongoose.Schema({
  examinationYear: { type: String, default: '2026-2027' },
  school: { type: String, default: 'NAVALS NATIONAL ACADEMY' },
  class: { type: String, required: true }, // 'X' or 'XII'
  section: { type: String, default: 'A' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  rollNo: { type: String, required: true },
  admissionNo: { type: String, required: true },
  candidateName: { type: String, required: true },
  mother: { type: String, default: '' },
  father: { type: String, default: '' },
  subjects: { type: String, default: '184, 085, 041, 086, 087' },
  status: { type: String, default: 'Confirmed', enum: ['Confirmed', 'Pending'] }
}, {
  timestamps: true
});

module.exports = mongoose.model('CbseExamConfirmation', cbseExamConfirmationSchema);
