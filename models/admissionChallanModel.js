const mongoose = require('mongoose');

const admissionChallanSchema = new mongoose.Schema({
  challanNo: { type: String, required: true, unique: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  studentName: { type: String, required: true },
  admissionNo: { type: String, required: true },
  class: { type: String, required: true },
  section: { type: String, default: 'A' },
  bankName: { type: String, default: 'Punjab National Bank' },
  bankAccountNo: { type: String, default: '50210001002030' },
  totalAmount: { type: Number, required: true },
  generatedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  dueDate: { type: String, default: () => new Date(Date.now() + 15*24*60*60*1000).toISOString().split('T')[0] },
  status: { type: String, default: 'Generated', enum: ['Generated', 'Paid', 'Cancelled'] }
}, { timestamps: true });

module.exports = mongoose.model('AdmissionChallan', admissionChallanSchema);
