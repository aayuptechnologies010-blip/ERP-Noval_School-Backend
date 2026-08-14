const mongoose = require('mongoose');

const payslipSchema = new mongoose.Schema(
  {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      required: [true, 'Staff ID is required'],
    },
    month: {
      type: String, // e.g. "October" or "10"
      required: [true, 'Month is required'],
    },
    year: {
      type: Number, // e.g. 2023
      required: [true, 'Year is required'],
    },
    earnings: {
      basicPay: { type: Number, default: 0 },
      houseRentAllowance: { type: Number, default: 0 },
      conveyanceAllowance: { type: Number, default: 0 },
      medicalAllowance: { type: Number, default: 0 },
      others: { type: Number, default: 0 },
    },
    deductions: {
      providentFund: { type: Number, default: 0 },
      professionalTax: { type: Number, default: 0 },
      incomeTax: { type: Number, default: 0 },
      others: { type: Number, default: 0 },
    },
    grossEarnings: {
      type: Number,
      required: true,
      default: 0
    },
    totalDeductions: {
      type: Number,
      required: true,
      default: 0
    },
    netPayableAmount: {
      type: Number,
      required: true,
      default: 0
    },
    status: {
      type: String,
      enum: ['Generated', 'Paid'],
      default: 'Generated'
    }
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate payslips for the same staff in a given month/year
payslipSchema.index({ staffId: 1, month: 1, year: 1 }, { unique: true });

const Payslip = mongoose.model('Payslip', payslipSchema);
module.exports = Payslip;
