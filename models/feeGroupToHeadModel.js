const mongoose = require('mongoose');

const mappedHeadSchema = new mongoose.Schema({
  feeHead: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeHead', required: true },
  installment: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeInstallment' }, // Optional
  feeAccount: { type: String },
  feePostAccount: { type: String },
  checked: { type: Boolean, default: false }
});

const feeGroupToHeadSchema = new mongoose.Schema({
  feeGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeGroup', required: true, unique: true },
  mappedHeads: [mappedHeadSchema]
}, { timestamps: true });

module.exports = mongoose.model('FeeGroupToHead', feeGroupToHeadSchema);
