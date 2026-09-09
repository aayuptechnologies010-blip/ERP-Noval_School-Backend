const mongoose = require('mongoose');

const studentCharacteristicSchema = new mongoose.Schema({
  session: { type: String, default: '2026-2027' },
  class: { type: String, required: true },
  section: { type: String, default: 'A' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  admissionNo: { type: String, required: true },
  studentName: { type: String, required: true },
  fatherName: { type: String, default: '' },
  moral: { type: String, default: 'Good' },
  char1: { type: String, default: 'Disciplined' },
  char2: { type: String, default: 'Punctual' },
  char3: { type: String, default: 'Respectful' },
  remark: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('StudentCharacteristic', studentCharacteristicSchema);
