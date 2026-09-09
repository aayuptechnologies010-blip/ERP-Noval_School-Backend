const mongoose = require('mongoose');

const transferCertificateSchema = new mongoose.Schema({
  session: { type: String, default: '2026-2027' },
  board: { type: String, default: 'CBSE', enum: ['CBSE', 'UP Board'] },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  admissionNo: { type: String, required: true },
  name: { type: String, required: true },
  mother: { type: String, default: '' },
  father: { type: String, default: '' },
  dob: { type: String, default: '' },
  class: { type: String, default: '' },
  section: { type: String, default: '' },
  billNo: { type: String, default: '' },
  schoolNo: { type: String, default: '70211' },
  affiliationNo: { type: String, default: 'CBSE-2130842' },
  address: { type: String, default: '' },
  contact: { type: String, default: '' },

  tcNo: { type: String, default: '' },
  bookNo: { type: String, default: 'BK-01' },
  slcNo: { type: String, default: '' },
  srNo: { type: String, default: '' },

  applyDate: { type: String, default: () => new Date().toLocaleDateString('en-GB') },
  issueDate: { type: String, default: '' },
  cancelDate: { type: String, default: '' },
  cancelReason: { type: String, default: '' },

  status: { type: String, default: 'Draft', enum: ['Draft', 'Generated', 'Cancelled'] },

  reason: { type: String, default: 'Parents Transfer' },
  conduct: { type: String, default: 'Good' },
  feePaidUpto: { type: String, default: 'March 2026' },
  workingDays: { type: String, default: '210' },
  daysPresent: { type: String, default: '198' },
  duesCleared: { type: String, default: 'Yes' },
  failed: { type: String, default: 'No' },
  subjectsStudied: { type: String, default: 'English, Hindi, Mathematics, Science, Social Science' },
  qualifiedForPromotion: { type: String, default: 'Yes' },
  feeConcession: { type: String, default: 'No' },
  nccCadet: { type: String, default: 'No' },
  gamesPlayed: { type: String, default: 'Cricket, Football' },
  extraActivity: { type: String, default: 'Sports - Inter-School Athletics' },
  remarks: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('TransferCertificate', transferCertificateSchema);
