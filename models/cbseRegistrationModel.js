const mongoose = require('mongoose');

const cbseRegistrationSchema = new mongoose.Schema({
  session: { type: String, default: '2026-2027' },
  school: { type: String, default: 'NAVALS NATIONAL ACADEMY' },
  wing: { type: String, default: 'Senior Wing' },
  class: { type: String, required: true }, // 'IX' or 'XI'
  section: { type: String, default: 'A' },
  stream: { type: String, default: 'Science (PCM)' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  admissionNo: { type: String, required: true },
  name: { type: String, required: true },
  mother: { type: String, default: '' },
  father: { type: String, default: '' },
  dob: { type: String, default: '' },
  regNo: { type: String, default: '' },
  subjects: { type: String, default: '041, 042, 043, 301, 048' },
  status: { type: String, default: 'Registered', enum: ['Registered', 'Pending', 'Verified'] }
}, {
  timestamps: true
});

module.exports = mongoose.model('CbseRegistration', cbseRegistrationSchema);
