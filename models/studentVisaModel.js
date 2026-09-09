const mongoose = require('mongoose');

const studentVisaSchema = new mongoose.Schema({
  session: { type: String, default: '2026-2027' },
  class: { type: String, required: true },
  section: { type: String, default: 'A' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  admissionNo: { type: String, required: true },
  name: { type: String, required: true },
  vacFrom: { type: String, default: '' },
  vacTo: { type: String, default: '' },
  beforeFrom: { type: String, default: '' },
  beforeTo: { type: String, default: '' },
  afterFrom: { type: String, default: '' },
  afterTo: { type: String, default: '' },
  visaPlace: { type: String, default: 'Embassy of India' },
  joiningDate: { type: String, default: '' },
  remark: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('StudentVisa', studentVisaSchema);
