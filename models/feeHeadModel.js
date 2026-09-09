const mongoose = require('mongoose');

const feeHeadSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  printName: { type: String, required: true },
  type: { type: String, required: true }, // Lifetime, Installment, Annual
  priority: { type: Number, required: true },
  category: { type: String, required: true }, // Regular, Opn Bal, Opn Dues, Discount, Fine, Cheque Bounce, Transport
  ledger: { type: String },
  tallyLedger: { type: String },
  showInCertificate: { type: String, default: 'False' }, // 'True' or 'False'
  refundable: { type: String, default: 'False' } // 'True' or 'False'
}, { timestamps: true });

module.exports = mongoose.model('FeeHead', feeHeadSchema);
