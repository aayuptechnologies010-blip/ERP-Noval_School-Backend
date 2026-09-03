const mongoose = require('mongoose');

const studentFeeLedgerSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      unique: true
    },
    totalDues: {
      type: Number,
      default: 0
    },
    totalPaid: {
      type: Number,
      default: 0
    },
    advanceAmount: {
      type: Number,
      default: 0
    },
    lastPaymentDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const StudentFeeLedger = mongoose.model('StudentFeeLedger', studentFeeLedgerSchema);
module.exports = StudentFeeLedger;
