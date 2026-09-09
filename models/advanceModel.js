const mongoose = require('mongoose');

// 1. Fix Advance Account Schema (Configuration of Advance Ledger Accounts)
const fixAdvanceAccountSchema = new mongoose.Schema({
  accountName: {
    type: String,
    required: [true, 'Account Name is required'],
    trim: true
  },
  ledgerAccountId: {
    type: String,
    default: ''
  },
  ledgerAccountName: {
    type: String,
    default: 'General Advance Ledger'
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, { timestamps: true });

// 2. Advance Entry Schema (Salary Advance Disbursed to Staff)
const advanceEntrySchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  staffName: {
    type: String,
    required: [true, 'Staff Name is required'],
    trim: true
  },
  employeeId: {
    type: String,
    default: ''
  },
  designation: {
    type: String,
    default: 'Faculty'
  },
  department: {
    type: String,
    default: 'General'
  },
  staffType: {
    type: String,
    default: 'Teaching'
  },
  advanceAmount: {
    type: Number,
    required: [true, 'Advance Amount is required'],
    min: [0, 'Advance Amount cannot be negative']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  recoveryMode: {
    type: String,
    enum: ['Monthly Salary Deduction', 'Cash / Direct Repayment', 'Custom Schedule'],
    default: 'Monthly Salary Deduction'
  },
  numberOfInstallments: {
    type: Number,
    default: 1
  },
  monthlyInstallmentAmount: {
    type: Number,
    default: 0
  },
  accountName: {
    type: String,
    default: 'Staff Salary Advance Ledger A/c'
  },
  paymentMode: {
    type: String,
    enum: ['Cheque', 'Bank Transfer', 'Cash', 'NEFT/RTGS', 'UPI'],
    default: 'Bank Transfer'
  },
  chequeNo: {
    type: String,
    default: ''
  },
  narration: {
    type: String,
    default: ''
  },
  recoveredAmount: {
    type: Number,
    default: 0
  },
  leftAmount: {
    type: Number,
    default: function() {
      return this.advanceAmount - (this.recoveredAmount || 0);
    }
  },
  status: {
    type: String,
    enum: ['Active', 'Partially Recovered', 'Fully Recovered', 'Waived'],
    default: 'Active'
  }
}, { timestamps: true });

// 3. Advance Repayment Schema (Installment or Lump sum Repayment)
const advanceRepaymentSchema = new mongoose.Schema({
  advanceEntryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdvanceEntry',
    required: true
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  staffName: {
    type: String,
    required: [true, 'Staff Name is required'],
    trim: true
  },
  employeeId: {
    type: String,
    default: ''
  },
  repaymentDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  repaymentAmount: {
    type: Number,
    required: [true, 'Repayment Amount is required'],
    min: [1, 'Repayment Amount must be greater than zero']
  },
  totalAdvance: {
    type: Number,
    default: 0
  },
  previousRecovered: {
    type: Number,
    default: 0
  },
  leftAmount: {
    type: Number,
    default: 0
  },
  accountName: {
    type: String,
    default: 'Staff Salary Advance Ledger A/c'
  },
  paymentMode: {
    type: String,
    enum: ['Salary Deduction', 'Cheque', 'Cash', 'Bank Transfer', 'UPI'],
    default: 'Salary Deduction'
  },
  chequeNo: {
    type: String,
    default: ''
  },
  narration: {
    type: String,
    default: 'Monthly advance repayment deduction'
  },
  status: {
    type: String,
    enum: ['Approved', 'Pending', 'Cancelled'],
    default: 'Approved'
  }
}, { timestamps: true });

const FixAdvanceAccount = mongoose.model('FixAdvanceAccount', fixAdvanceAccountSchema);
const AdvanceEntry = mongoose.model('AdvanceEntry', advanceEntrySchema);
const AdvanceRepayment = mongoose.model('AdvanceRepayment', advanceRepaymentSchema);

module.exports = {
  FixAdvanceAccount,
  AdvanceEntry,
  AdvanceRepayment
};
