const mongoose = require('mongoose');

const prospectusSettlementSchema = new mongoose.Schema({
  prospectusNo: { type: String, required: true, unique: true },
  studentName: { type: String, required: true },
  admissionNo: { type: String },
  class: { type: String, default: 'NUR' },
  saleDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  settledDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  amount: { type: Number, default: 1000 },
  status: { type: String, default: 'Settled', enum: ['Settled', 'Pending', 'Cancelled'] },
  selected: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('ProspectusSettlement', prospectusSettlementSchema);
