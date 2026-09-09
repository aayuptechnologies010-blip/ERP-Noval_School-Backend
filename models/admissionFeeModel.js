const mongoose = require('mongoose');

const feeHeadItemSchema = new mongoose.Schema({
  head: { type: String, required: true },
  payable: { type: Number, default: 0 },
  concession: { type: Number, default: 0 },
  paid: { type: Number, default: 0 }
});

const admissionFeeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  studentName: { type: String, required: true },
  admissionNo: { type: String, required: true },
  class: { type: String, required: true },
  section: { type: String, default: 'A' },
  receiptNo: { type: String, required: true, unique: true },
  receiptDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  feeHeads: [feeHeadItemSchema],
  totalPayable: { type: Number, default: 0 },
  totalConcession: { type: Number, default: 0 },
  totalPaid: { type: Number, default: 0 },
  paymentMode: { type: String, default: 'Cash', enum: ['Cash', 'Cheque', 'Online', 'Demand Draft'] },
  referenceNo: { type: String, default: '' },
  remarks: { type: String, default: '' }
}, { timestamps: true });

// Amount structure model in same file or separate
const admissionAmtStructureSchema = new mongoose.Schema({
  class: { type: String, required: true },
  session: { type: String, default: '2026-2027' },
  feeType: { type: String, default: 'Regular' },
  heads: [{
    head: { type: String, required: true },
    amount: { type: Number, required: true },
    account: { type: String, default: 'Fee A/c' }
  }],
  totalAmount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = {
  AdmissionFee: mongoose.model('AdmissionFee', admissionFeeSchema),
  AdmissionAmtStructure: mongoose.model('AdmissionAmtStructure', admissionAmtStructureSchema)
};
