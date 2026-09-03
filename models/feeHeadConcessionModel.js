const mongoose = require('mongoose');

const feeHeadConcessionAmountSchema = new mongoose.Schema({
  feeHead: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeHead', required: true },
  amount: { type: Number, default: 0 },
  isPercent: { type: Boolean, default: false }
});

const feeHeadConcessionSchema = new mongoose.Schema({
  concession: { type: mongoose.Schema.Types.ObjectId, ref: 'Concession', required: true },
  installment: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeInstallment' }, // null for 'Select All' or 'All'
  concessions: [feeHeadConcessionAmountSchema]
}, { timestamps: true });

feeHeadConcessionSchema.index({ concession: 1, installment: 1 }, { unique: true });

module.exports = mongoose.model('FeeHeadConcession', feeHeadConcessionSchema);
