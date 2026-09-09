const mongoose = require('mongoose');

const feeAmountSchema = new mongoose.Schema({
  feeHead: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeHead', required: true },
  amount: { type: Number, default: 0 }
});

const feeAmountGroupSchema = new mongoose.Schema({
  feeGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeGroup', required: true },
  installment: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeInstallment' }, // null for 'All'
  amounts: [feeAmountSchema]
}, { timestamps: true });

// Ensure uniqueness per group and installment
feeAmountGroupSchema.index({ feeGroup: 1, installment: 1 }, { unique: true });

module.exports = mongoose.model('FeeAmountGroup', feeAmountGroupSchema);
