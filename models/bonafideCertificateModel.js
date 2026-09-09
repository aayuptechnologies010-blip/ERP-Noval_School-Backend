const mongoose = require('mongoose');

const bonafideCertificateSchema = new mongoose.Schema({
  session: { type: String, default: '2026-2027' },
  bonafideNo: { type: String, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  admissionNo: { type: String, required: true },
  studentName: { type: String, required: true },
  mother: { type: String, default: '' },
  father: { type: String, default: '' },
  nationality: { type: String, default: 'Indian' },
  dob: { type: String, default: '' },
  class: { type: String, default: '' },
  section: { type: String, default: '' },
  billNo: { type: String, default: '' },
  schoolNo: { type: String, default: '70211' },
  affiliationNo: { type: String, default: 'CBSE-2130842' },

  applyingDate: { type: String, default: () => new Date().toLocaleDateString('en-GB') },
  issueDate: { type: String, default: () => new Date().toLocaleDateString('en-GB') },
  purpose: { type: String, default: 'Passport / Visa Purpose' },
  character: { type: String, default: 'Good' },
  remark: { type: String, default: 'Bonafide student of this institution.' },
  status: { type: String, default: 'Issued', enum: ['Draft', 'Issued'] }
}, {
  timestamps: true
});

module.exports = mongoose.model('BonafideCertificate', bonafideCertificateSchema);
