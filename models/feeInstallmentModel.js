const mongoose = require('mongoose');

const feeInstallmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  printName: { type: String, required: true },
  pref: { type: Number, required: true },
  dueOnYear: { type: String, default: 'Year' },
  dueOnMonth: { type: String, default: 'Month' },
  dueOnDay: { type: String, default: 'Day' },
  dueYear: { type: String, default: 'Year' },
  dueMonth: { type: String, default: 'Month' },
  dueDay: { type: String, default: 'Day' },
  selectedMonth: { type: String, default: 'None selected' }
}, { timestamps: true });

module.exports = mongoose.model('FeeInstallment', feeInstallmentSchema);
