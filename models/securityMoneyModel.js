const mongoose = require('mongoose');

const securityMoneySchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Deposited', 'Returned'],
    default: 'Deposited'
  },
  receiptNo: {
    type: String,
    required: true,
    unique: true
  },
  depositDate: {
    type: Date,
    default: Date.now
  },
  returnDate: {
    type: Date
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'Cheque', 'Online', 'DD', 'Card'],
    default: 'Cash'
  },
  remarks: {
    type: String
  }
}, {
  timestamps: true
});

const SecurityMoney = mongoose.model('SecurityMoney', securityMoneySchema);

module.exports = SecurityMoney;
