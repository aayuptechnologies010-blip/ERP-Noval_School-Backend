const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const { FixAdvanceAccount, AdvanceEntry, AdvanceRepayment } = require('./models/advanceModel');

const seedAdvanceData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/erp-school';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for Advance seeding...');

    // Clear existing
    await FixAdvanceAccount.deleteMany({});
    await AdvanceEntry.deleteMany({});
    await AdvanceRepayment.deleteMany({});
    console.log('Cleared existing advance collections.');

    // 1. Seed Fix Advance Accounts
    const acc1 = await FixAdvanceAccount.create({
      accountName: 'Ayup Tech Advance Reserve A/c',
      ledgerAccountId: 'ACC-AYUP-001',
      ledgerAccountName: 'HDFC Bank - 50100429188',
      description: 'Dedicated Staff Salary Advance Reserve Managed by Ayup Tech',
      status: 'Active'
    });

    const acc2 = await FixAdvanceAccount.create({
      accountName: 'Staff Festival & Medical Advance A/c',
      ledgerAccountId: 'ACC-GEN-002',
      ledgerAccountName: 'State Bank of India - 30291823901',
      description: 'Short-term staff emergency and festival advance account',
      status: 'Active'
    });

    const acc3 = await FixAdvanceAccount.create({
      accountName: 'General Salary Advance Ledger A/c',
      ledgerAccountId: 'ACC-GEN-003',
      ledgerAccountName: 'ICICI Bank - 002105018293',
      description: 'General institutional advance account',
      status: 'Active'
    });

    console.log('Seeded 3 Fix Advance Accounts with Ayup Tech.');

    // 2. Seed Advance Entries
    const entry1 = await AdvanceEntry.create({
      staffName: 'Ayup Tech',
      employeeId: 'EMP-AT-2026',
      designation: 'Senior Fullstack Lead',
      department: 'Information Technology',
      staffType: 'Teaching',
      advanceAmount: 50000,
      date: new Date('2026-07-15'),
      recoveryMode: 'Monthly Salary Deduction',
      numberOfInstallments: 5,
      monthlyInstallmentAmount: 10000,
      accountName: acc1.accountName,
      paymentMode: 'Bank Transfer',
      chequeNo: 'IMPS-99210481',
      narration: 'Special technical equipment & research grant advance for Ayup Tech',
      recoveredAmount: 20000,
      leftAmount: 30000,
      status: 'Partially Recovered'
    });

    const entry2 = await AdvanceEntry.create({
      staffName: 'Ayup Tech Senior Faculty',
      employeeId: 'EMP-AT-2027',
      designation: 'Assistant Professor - CS',
      department: 'Computer Science',
      staffType: 'Teaching',
      advanceAmount: 30000,
      date: new Date('2026-08-20'),
      recoveryMode: 'Monthly Salary Deduction',
      numberOfInstallments: 3,
      monthlyInstallmentAmount: 10000,
      accountName: acc2.accountName,
      paymentMode: 'Cheque',
      chequeNo: 'CHQ-772910',
      narration: 'Medical and family festival advance for Ayup Tech Faculty',
      recoveredAmount: 0,
      leftAmount: 30000,
      status: 'Active'
    });

    const entry3 = await AdvanceEntry.create({
      staffName: 'Vikram Sharma',
      employeeId: 'EMP-2026-08',
      designation: 'Senior Mathematics Lecturer',
      department: 'Mathematics',
      staffType: 'Teaching',
      advanceAmount: 25000,
      date: new Date('2026-06-10'),
      recoveryMode: 'Monthly Salary Deduction',
      numberOfInstallments: 5,
      monthlyInstallmentAmount: 5000,
      accountName: acc3.accountName,
      paymentMode: 'Bank Transfer',
      chequeNo: 'NEFT-883921',
      narration: 'Relocation & housing assistance advance',
      recoveredAmount: 25000,
      leftAmount: 0,
      status: 'Fully Recovered'
    });

    console.log('Seeded 3 Advance Entries with Ayup Tech.');

    // 3. Seed Advance Repayments
    await AdvanceRepayment.create({
      advanceEntryId: entry1._id,
      staffName: entry1.staffName,
      employeeId: entry1.employeeId,
      repaymentDate: new Date('2026-08-01'),
      repaymentAmount: 10000,
      totalAdvance: entry1.advanceAmount,
      previousRecovered: 0,
      leftAmount: 40000,
      accountName: entry1.accountName,
      paymentMode: 'Salary Deduction',
      chequeNo: 'SAL-DED-AUG26',
      narration: 'August 2026 payroll salary deduction for Ayup Tech',
      status: 'Approved'
    });

    await AdvanceRepayment.create({
      advanceEntryId: entry1._id,
      staffName: entry1.staffName,
      employeeId: entry1.employeeId,
      repaymentDate: new Date('2026-09-01'),
      repaymentAmount: 10000,
      totalAdvance: entry1.advanceAmount,
      previousRecovered: 10000,
      leftAmount: 30000,
      accountName: entry1.accountName,
      paymentMode: 'Salary Deduction',
      chequeNo: 'SAL-DED-SEP26',
      narration: 'September 2026 payroll salary deduction for Ayup Tech',
      status: 'Approved'
    });

    await AdvanceRepayment.create({
      advanceEntryId: entry3._id,
      staffName: entry3.staffName,
      employeeId: entry3.employeeId,
      repaymentDate: new Date('2026-08-15'),
      repaymentAmount: 25000,
      totalAdvance: entry3.advanceAmount,
      previousRecovered: 0,
      leftAmount: 0,
      accountName: entry3.accountName,
      paymentMode: 'Bank Transfer',
      chequeNo: 'RTGS-774421',
      narration: 'Full lumpsum repayment via bank transfer',
      status: 'Approved'
    });

    console.log('Seeded 3 Advance Repayments with Ayup Tech.');
    console.log('✅ ADVANCE SECTION DATA SEEDED SUCCESSFULLY!');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding advance data:', err);
    process.exit(1);
  }
};

seedAdvanceData();
