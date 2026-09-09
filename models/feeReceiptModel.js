const mongoose = require('mongoose');

const feeReceiptSchema = new mongoose.Schema(
  {
    receiptNo: {
      type: String,
      required: true,
      unique: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear'
    },
    paymentMode: {
      type: String,
      enum: ['Cash', 'Cheque', 'Online', 'DD', 'Card', 'Adjustment'],
      default: 'Cash'
    },
    transactionType: {
      type: String,
      enum: ['Payment', 'Refund', 'AdvanceAdjustment'],
      default: 'Payment'
    },
    receiptDate: {
      type: Date,
      default: Date.now
    },
    amountPaid: {
      type: Number,
      required: true
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    chequeStatus: {
      type: String,
      enum: ['Pending', 'Cleared', 'Bounced'],
      default: 'Pending'
    },
    advanceUsed: {
      type: Number,
      default: 0
    },
    remarks: {
      type: String
    },
    // If cheque/online
    referenceNumber: {
      type: String
    },
    bankName: {
      type: String
    },
    chequeDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['Successful', 'Cancelled', 'Bounced', 'Pending'],
      default: 'Successful'
    },
    cancelledReason: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const FeeReceipt = mongoose.model('FeeReceipt', feeReceiptSchema);
module.exports = FeeReceipt;
