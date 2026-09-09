const mongoose = require('mongoose');

// 1. Leave Without Pay (LWP) & Attendance Adjustments
const leaveLwpSchema = new mongoose.Schema({
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
  department: {
    type: String,
    default: 'General'
  },
  designation: {
    type: String,
    default: 'Faculty'
  },
  staffType: {
    type: String,
    default: 'Teaching'
  },
  salaryAccount: {
    type: String,
    default: 'Ayup Salary Account'
  },
  monthYear: {
    type: String,
    required: true,
    default: 'Aug-2026'
  },
  workingDays: {
    type: Number,
    default: 26
  },
  presentDays: {
    type: Number,
    default: 26
  },
  paidLeaves: {
    type: Number,
    default: 0
  },
  lwpDays: {
    type: Number,
    default: 0
  },
  dailyRate: {
    type: Number,
    default: 0
  },
  lwpDeduction: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Processed'],
    default: 'Approved'
  }
}, { timestamps: true });

// 2. Occasional Allowances & Occasional Deductions
const occasionalAllowanceSchema = new mongoose.Schema({
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
  department: {
    type: String,
    default: 'General'
  },
  designation: {
    type: String,
    default: 'Faculty'
  },
  staffType: {
    type: String,
    default: 'Teaching'
  },
  salaryAccount: {
    type: String,
    default: 'Ayup Salary Account'
  },
  monthYear: {
    type: String,
    required: true,
    default: 'Aug-2026'
  },
  headName: {
    type: String,
    required: [true, 'Salary Head Name is required']
  },
  headType: {
    type: String,
    enum: ['Addition', 'Deduction'],
    default: 'Addition'
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    default: 0
  },
  remarks: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'Cancelled'],
    default: 'Active'
  }
}, { timestamps: true });

// 3. Central Monthly Salary Payroll Records
const salaryPayrollSchema = new mongoose.Schema({
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
  department: {
    type: String,
    default: 'General'
  },
  designation: {
    type: String,
    default: 'Faculty'
  },
  staffType: {
    type: String,
    default: 'Teaching'
  },
  salaryAccount: {
    type: String,
    default: 'Ayup Salary Account'
  },
  bankName: {
    type: String,
    default: 'HDFC Bank'
  },
  bankAccountNo: {
    type: String,
    default: '50100429188'
  },
  ifscCode: {
    type: String,
    default: 'HDFC0001234'
  },
  paymentMode: {
    type: String,
    enum: ['Bank Transfer', 'Cheque', 'Cash'],
    default: 'Bank Transfer'
  },
  monthYear: {
    type: String,
    required: true,
    default: 'Aug-2026'
  },
  salaryType: {
    type: String,
    enum: ['Regular', 'Hourly'],
    default: 'Regular'
  },
  // Earnings
  basicSalary: { type: Number, default: 0 },
  da: { type: Number, default: 0 },
  hra: { type: Number, default: 0 },
  conveyance: { type: Number, default: 0 },
  specialAllowance: { type: Number, default: 0 },
  grossSalary: { type: Number, default: 0 },
  // Deductions
  pfDeduction: { type: Number, default: 0 },
  esiDeduction: { type: Number, default: 0 },
  tdsDeduction: { type: Number, default: 0 },
  ptDeduction: { type: Number, default: 0 },
  gsliDeduction: { type: Number, default: 0 },
  lwpDeduction: { type: Number, default: 0 },
  insuranceDeduction: { type: Number, default: 0 },
  advanceDeduction: { type: Number, default: 0 },
  totalDeductions: { type: Number, default: 0 },
  // Net Payable
  netSalary: { type: Number, default: 0 },
  // Statements & Statutory IDs
  uanNumber: { type: String, default: '' },
  pfNumber: { type: String, default: '' },
  esiNumber: { type: String, default: '' },
  chequeNo: { type: String, default: '' },
  chequeDate: { type: Date, default: Date.now },
  policyVendor: { type: String, default: 'LIC' },
  policyNumber: { type: String, default: '' },
  bankAdviceRef: { type: String, default: '' },
  statementGenerated: { type: Boolean, default: false },
  // Career, Increments & Pay Commission Fixation
  previousBasic: { type: Number, default: 0 },
  incrementRate: { type: Number, default: 3 }, // 3% annual increment
  revisedBasic: { type: Number, default: 0 },
  incrementOrderNo: { type: String, default: '' },
  incrementDate: { type: String, default: '01-Jul-2026' },
  macpStage: { type: String, default: '1st MACP (10 Yrs)' },
  macpLevel: { type: String, default: 'Level 10 (₹56,100 - ₹1,77,500)' },
  macpDate: { type: String, default: '15-Aug-2026' },
  payCommission: { type: String, default: '7th CPC' },
  payBand: { type: String, default: 'PB-3 (15600-39100)' },
  gradePay: { type: Number, default: 5400 },
  matrixLevel: { type: String, default: 'Level 10' },
  matrixCell: { type: Number, default: 3 },
  // Terminal Benefits, Gratuity & Superannuation
  doj: { type: String, default: '01-Jul-2016' },
  dob: { type: String, default: '15-May-1985' },
  dateOfRetire: { type: String, default: '31-May-2045' },
  superannuationAge: { type: Number, default: 60 },
  qualifyingServiceYears: { type: Number, default: 10 },
  gratuityAmount: { type: Number, default: 0 },
  superannuationAmount: { type: Number, default: 0 },
  annuityPlan: { type: String, default: 'Ayup Guaranteed Pension Plan' },
  // Pension & Service Book
  ppoNumber: { type: String, default: '' },
  pensionAmount: { type: Number, default: 0 },
  commutationAmount: { type: Number, default: 0 },
  dearnessRelief: { type: Number, default: 0 },
  serviceBookNo: { type: String, default: '' },
  // Demographics, HR & Communication
  gender: { type: String, default: 'Male' },
  category: { type: String, default: 'General' },
  bloodGroup: { type: String, default: 'B+' },
  panNumber: { type: String, default: '' },
  aadharNumber: { type: String, default: '' },
  mobileNo: { type: String, default: '' },
  qualification: { type: String, default: 'M.Tech / Ph.D' },
  experienceYears: { type: Number, default: 10 },
  permanentAddress: { type: String, default: 'Ayup Tech Campus, Tech Zone IV, Greater Noida, UP' },
  emergencyContact: { type: String, default: '+91 98765 43210' },
  smsStatus: { type: String, default: 'Delivered' },
  smsDeliveredAt: { type: String, default: '01-Aug-2026 10:30 AM' },
  status: {
    type: String,
    enum: ['Generated', 'Paid', 'Frozen', 'Draft'],
    default: 'Generated'
  }
}, { timestamps: true });

// 4. IT Head Entry (Income Tax Investment Declarations)
const itHeadEntrySchema = new mongoose.Schema({
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
  financialYear: {
    type: String,
    default: '2026-2027'
  },
  itSection: {
    type: String,
    required: [true, 'IT Section / Head is required'],
    default: 'Section 80C - Life Insurance & PF'
  },
  declaredAmount: {
    type: Number,
    default: 0
  },
  verifiedAmount: {
    type: Number,
    default: 0
  },
  maxEligibleAmount: {
    type: Number,
    default: 150000
  },
  taxSavingBenefit: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Verified', 'Pending', 'Rejected'],
    default: 'Verified'
  },
  remarks: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// 5. TDS Remittance & Challan Deposit Records
const tdsRemittanceSchema = new mongoose.Schema({
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
  panNumber: {
    type: String,
    default: 'AYUPT1234K'
  },
  monthYear: {
    type: String,
    required: true,
    default: 'Aug-2026'
  },
  grossSalary: {
    type: Number,
    default: 0
  },
  taxableSalary: {
    type: Number,
    default: 0
  },
  tdsAmount: {
    type: Number,
    default: 0
  },
  challanNo: {
    type: String,
    default: 'CHL-2026-8821'
  },
  bsrCode: {
    type: String,
    default: '0210042'
  },
  depositDate: {
    type: Date,
    default: Date.now
  },
  chequeNo: {
    type: String,
    default: 'CHQ-TDS-01'
  },
  schoolBank: {
    type: String,
    default: 'HDFC Bank - 50100429188'
  },
  status: {
    type: String,
    enum: ['Deposited', 'Pending'],
    default: 'Deposited'
  }
}, { timestamps: true });

// 6. Gratuity Calculation (Statutory Formula)
const gratuitySchema = new mongoose.Schema({
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
  department: {
    type: String,
    default: 'Information Technology'
  },
  designation: {
    type: String,
    default: 'Senior Fullstack Lead'
  },
  joiningDate: {
    type: Date,
    required: true,
    default: () => new Date('2018-07-01')
  },
  calculationDate: {
    type: Date,
    default: Date.now
  },
  completedYears: {
    type: Number,
    default: 8
  },
  lastDrawnBasic: {
    type: Number,
    default: 50000
  },
  lastDrawnDA: {
    type: Number,
    default: 25000
  },
  gratuityAmount: {
    type: Number,
    default: 346154 // (15 * 75000 * 8) / 26
  },
  statutoryCap: {
    type: Number,
    default: 2000000
  },
  isEligible: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['Calculated', 'Approved', 'Disbursed'],
    default: 'Calculated'
  },
  remarks: {
    type: String,
    default: 'Eligible for statutory gratuity benefits after completing continuous service.'
  }
}, { timestamps: true });

// 7. Statutory Annual / Festival Bonus Calculation
const bonusSchema = new mongoose.Schema({
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
  staffType: {
    type: String,
    default: 'Teaching'
  },
  department: {
    type: String,
    default: 'Information Technology'
  },
  financialYear: {
    type: String,
    default: '2026-2027'
  },
  periodFrom: {
    type: String,
    default: 'Apr-2026'
  },
  periodTo: {
    type: String,
    default: 'Mar-2027'
  },
  calculationDate: {
    type: Date,
    default: Date.now
  },
  payableMonth: {
    type: String,
    default: 'Aug-2026'
  },
  eligibleWages: {
    type: Number,
    default: 84000 // 7,000 * 12 statutory wage ceiling or actual basic
  },
  bonusPercentage: {
    type: Number,
    default: 8.33
  },
  bonusAmount: {
    type: Number,
    default: 7000
  },
  status: {
    type: String,
    enum: ['Calculated', 'Approved', 'Paid'],
    default: 'Approved'
  },
  remarks: {
    type: String,
    default: 'Statutory Annual Performance Bonus'
  }
}, { timestamps: true });

const LeaveLWP = mongoose.model('LeaveLWP', leaveLwpSchema);
const OccasionalAllowance = mongoose.model('OccasionalAllowance', occasionalAllowanceSchema);
const SalaryPayroll = mongoose.model('SalaryPayroll', salaryPayrollSchema);
const ITHeadEntry = mongoose.model('ITHeadEntry', itHeadEntrySchema);
const TDSRemittance = mongoose.model('TDSRemittance', tdsRemittanceSchema);
const GratuityCalculation = mongoose.model('GratuityCalculation', gratuitySchema);
const BonusCalculation = mongoose.model('BonusCalculation', bonusSchema);

// ==================== 9. AUTO INCREMENT RECORD ====================
const incrementRecordSchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  staffName: { type: String, required: true, trim: true },
  employeeId: { type: String, default: '' },
  department: { type: String, default: 'General' },
  designation: { type: String, default: 'Faculty' },
  staffType: { type: String, default: 'Teaching' },
  salaryAccount: { type: String, default: 'Ayup Salary Account' },
  schoolBank: { type: String, default: 'HDFC Bank' },
  incrementType: { type: String, enum: ['Basic', 'DA', 'TA', 'HRA'], default: 'Basic' },
  incrementAppliedFrom: { type: String, default: 'Aug-2026' },
  percentValue: { type: Number, default: 0 },
  amountValue: { type: Number, default: 0 },
  isAmountMode: { type: Boolean, default: false },
  activeForArrears: { type: Boolean, default: false },
  thisMonthOnly: { type: Boolean, default: false },
  previousAmount: { type: Number, default: 0 },
  incrementAmount: { type: Number, default: 0 },
  newAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['Applied', 'Pending', 'Rolled Back'], default: 'Applied' },
  remarks: { type: String, default: '' }
}, { timestamps: true });

// ==================== 10. STAFF SALARY STRUCTURE ====================
const staffSalaryStructureSchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  staffName: { type: String, required: true, trim: true },
  employeeId: { type: String, default: '' },
  department: { type: String, default: 'General' },
  designation: { type: String, default: 'Faculty' },
  staffType: { type: String, default: 'Teaching' },
  salaryAccount: { type: String, default: 'Ayup Salary Account' },
  salaryGroup: { type: String, default: 'Group-A' },
  basicSalary: { type: Number, default: 0 },
  da: { type: Number, default: 0 },
  hra: { type: Number, default: 0 },
  ta: { type: Number, default: 0 },
  specialAllowance: { type: Number, default: 0 },
  grossSalary: { type: Number, default: 0 },
  pfDeduction: { type: Number, default: 0 },
  esiDeduction: { type: Number, default: 0 },
  tdsDeduction: { type: Number, default: 0 },
  insuranceDeduction: { type: Number, default: 0 },
  totalDeductions: { type: Number, default: 0 },
  netSalary: { type: Number, default: 0 },
  effectiveFrom: { type: String, default: 'Apr-2026' },
  status: { type: String, enum: ['Active', 'Inactive', 'Revised'], default: 'Active' }
}, { timestamps: true });

// ==================== 11. GENERATE SALARY STATUS ====================
const salaryStatusRecordSchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  staffName: { type: String, required: true, trim: true },
  employeeId: { type: String, default: '' },
  department: { type: String, default: 'General' },
  designation: { type: String, default: 'Faculty' },
  staffType: { type: String, default: 'Teaching' },
  salaryAccount: { type: String, default: 'Ayup Salary Account' },
  schoolBank: { type: String, default: 'HDFC Bank' },
  monthYear: { type: String, default: 'Aug-2026' },
  generationStatus: { type: String, enum: ['Generated', 'Not Generated', 'Pending', 'Locked'], default: 'Generated' },
  generatedOn: { type: Date, default: Date.now },
  grossSalary: { type: Number, default: 0 },
  netSalary: { type: Number, default: 0 },
  remarks: { type: String, default: '' }
}, { timestamps: true });

// ==================== 12. DAILY WAGES ATTENDANCE ====================
const dailyWagesSchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  staffName: { type: String, required: true, trim: true },
  employeeId: { type: String, default: '' },
  department: { type: String, default: 'General' },
  designation: { type: String, default: 'Daily Wages Worker' },
  staffType: { type: String, default: 'Daily Wages' },
  salaryAccount: { type: String, default: 'Ayup Salary Account' },
  monthYear: { type: String, default: 'Aug-2026' },
  dailyWageRate: { type: Number, default: 500 },
  totalWorkingDays: { type: Number, default: 26 },
  daysPresent: { type: Number, default: 26 },
  daysAbsent: { type: Number, default: 0 },
  overtimeHours: { type: Number, default: 0 },
  overtimeRate: { type: Number, default: 75 },
  overtimeAmount: { type: Number, default: 0 },
  grossWages: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netWages: { type: Number, default: 0 },
  status: { type: String, enum: ['Pending', 'Approved', 'Paid', 'Locked'], default: 'Approved' },
  remarks: { type: String, default: '' }
}, { timestamps: true });

const IncrementRecord = mongoose.model('IncrementRecord', incrementRecordSchema);
const StaffSalaryStructureRecord = mongoose.model('StaffSalaryStructureRecord', staffSalaryStructureSchema);
const SalaryStatusRecord = mongoose.model('SalaryStatusRecord', salaryStatusRecordSchema);
const DailyWagesRecord = mongoose.model('DailyWagesRecord', dailyWagesSchema);

module.exports = {
  LeaveLWP,
  OccasionalAllowance,
  SalaryPayroll,
  ITHeadEntry,
  TDSRemittance,
  GratuityCalculation,
  BonusCalculation,
  IncrementRecord,
  StaffSalaryStructureRecord,
  SalaryStatusRecord,
  DailyWagesRecord
};
