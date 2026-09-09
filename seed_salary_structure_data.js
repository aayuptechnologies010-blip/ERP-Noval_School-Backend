const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const {
  LeaveLWP,
  OccasionalAllowance,
  SalaryPayroll,
  ITHeadEntry,
  TDSRemittance,
  GratuityCalculation,
  BonusCalculation
} = require('./models/salaryStructureModel');

const seedSalaryStructure = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/erp-school';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for Salary Structure seeding...');

    // Clear existing
    await LeaveLWP.deleteMany({});
    await OccasionalAllowance.deleteMany({});
    await SalaryPayroll.deleteMany({});
    await ITHeadEntry.deleteMany({});
    await TDSRemittance.deleteMany({});
    await GratuityCalculation.deleteMany({});
    await BonusCalculation.deleteMany({});
    console.log('Cleared existing salary structure collections.');

    // 1. Seed Leave LWP
    await LeaveLWP.insertMany([
      {
        staffName: 'Ayup Tech',
        employeeId: 'EMP-AT-2026',
        department: 'Information Technology',
        designation: 'Senior Fullstack Lead',
        staffType: 'Teaching',
        salaryAccount: 'Ayup Salary Account',
        monthYear: 'Aug-2026',
        workingDays: 26,
        presentDays: 25,
        paidLeaves: 1,
        lwpDays: 0,
        dailyRate: 2307,
        lwpDeduction: 0,
        status: 'Approved'
      },
      {
        staffName: 'Ayup Tech Senior Faculty',
        employeeId: 'EMP-AT-2027',
        department: 'Computer Science',
        designation: 'Assistant Professor - CS',
        staffType: 'Teaching',
        salaryAccount: 'Ayup Salary Account',
        monthYear: 'Aug-2026',
        workingDays: 26,
        presentDays: 23,
        paidLeaves: 1,
        lwpDays: 2,
        dailyRate: 1730,
        lwpDeduction: 3460,
        status: 'Approved'
      },
      {
        staffName: 'Vikram Sharma',
        employeeId: 'EMP-2026-08',
        department: 'Mathematics',
        designation: 'Senior Mathematics Lecturer',
        staffType: 'Teaching',
        salaryAccount: 'General Salary A/c',
        monthYear: 'Aug-2026',
        workingDays: 26,
        presentDays: 24,
        paidLeaves: 1,
        lwpDays: 1,
        dailyRate: 1538,
        lwpDeduction: 1538,
        status: 'Approved'
      }
    ]);
    console.log('Seeded Leave LWP records with Ayup Tech.');

    // 2. Seed Occasional Allowance / Deductions
    await OccasionalAllowance.insertMany([
      {
        staffName: 'Ayup Tech',
        employeeId: 'EMP-AT-2026',
        department: 'Information Technology',
        designation: 'Senior Fullstack Lead',
        staffType: 'Teaching',
        salaryAccount: 'Ayup Salary Account',
        monthYear: 'Aug-2026',
        headName: 'Performance Technical Grant & Architecture Incentive',
        headType: 'Addition',
        amount: 15000,
        remarks: 'Awarded for ERP software milestone delivery by Ayup Tech',
        status: 'Active'
      },
      {
        staffName: 'Ayup Tech Senior Faculty',
        employeeId: 'EMP-AT-2027',
        department: 'Computer Science',
        designation: 'Assistant Professor - CS',
        staffType: 'Teaching',
        salaryAccount: 'Ayup Salary Account',
        monthYear: 'Aug-2026',
        headName: 'Festival Bonus Advance Addition',
        headType: 'Addition',
        amount: 5000,
        remarks: 'Annual festival festive allowance',
        status: 'Active'
      },
      {
        staffName: 'Vikram Sharma',
        employeeId: 'EMP-2026-08',
        department: 'Mathematics',
        designation: 'Senior Mathematics Lecturer',
        staffType: 'Teaching',
        salaryAccount: 'General Salary A/c',
        monthYear: 'Aug-2026',
        headName: 'Exam Evaluation Remuneration',
        headType: 'Addition',
        amount: 4500,
        remarks: 'CBSE Board exam checking compensation',
        status: 'Active'
      }
    ]);
    console.log('Seeded Occasional Allowances with Ayup Tech.');

    // 3. Seed Monthly Salary Payroll
    await SalaryPayroll.insertMany([
      {
        staffName: 'Ayup Tech',
        employeeId: 'EMP-AT-2026',
        department: 'Information Technology',
        designation: 'Senior Fullstack Lead',
        staffType: 'Teaching',
        salaryAccount: 'Ayup Salary Account',
        bankName: 'HDFC Bank',
        bankAccountNo: '50100429188',
        ifscCode: 'HDFC0001234',
        paymentMode: 'Bank Transfer',
        monthYear: 'Aug-2026',
        salaryType: 'Regular',
        basicSalary: 60000,
        da: 30000,
        hra: 14400,
        conveyance: 3200,
        specialAllowance: 4500,
        grossSalary: 112100,
        pfDeduction: 1800,
        esiDeduction: 0,
        tdsDeduction: 5600,
        lwpDeduction: 0,
        insuranceDeduction: 2500,
        advanceDeduction: 10000,
        totalDeductions: 19900,
        netSalary: 92200,
        chequeNo: 'CHQ-AYUP-8821',
        chequeDate: new Date('2026-08-30'),
        policyVendor: 'LIC',
        policyNumber: 'LIC-AYUP-99210',
        bankAdviceRef: 'ADV-HDFC-AYUP-2026-01',
        statementGenerated: true,
        status: 'Generated'
      },
      {
        staffName: 'Ayup Tech Senior Faculty',
        employeeId: 'EMP-AT-2027',
        department: 'Computer Science',
        designation: 'Assistant Professor - CS',
        staffType: 'Teaching',
        salaryAccount: 'Ayup Salary Account',
        bankName: 'HDFC Bank',
        bankAccountNo: '50100429199',
        ifscCode: 'HDFC0001234',
        paymentMode: 'Bank Transfer',
        monthYear: 'Aug-2026',
        salaryType: 'Regular',
        basicSalary: 45000,
        da: 22500,
        hra: 10800,
        conveyance: 2500,
        specialAllowance: 3200,
        grossSalary: 84000,
        pfDeduction: 1800,
        esiDeduction: 0,
        tdsDeduction: 3500,
        lwpDeduction: 3460,
        insuranceDeduction: 1500,
        advanceDeduction: 0,
        totalDeductions: 10260,
        netSalary: 73740,
        chequeNo: 'CHQ-AYUP-8822',
        chequeDate: new Date('2026-08-30'),
        policyVendor: 'LIC',
        policyNumber: 'LIC-FACULTY-002',
        bankAdviceRef: 'ADV-HDFC-AYUP-2026-02',
        statementGenerated: true,
        status: 'Generated'
      },
      {
        staffName: 'Vikram Sharma',
        employeeId: 'EMP-2026-08',
        department: 'Mathematics',
        designation: 'Senior Mathematics Lecturer',
        staffType: 'Teaching',
        salaryAccount: 'General Salary A/c',
        bankName: 'State Bank of India',
        bankAccountNo: '30291823901',
        ifscCode: 'SBIN0004921',
        paymentMode: 'Cheque',
        monthYear: 'Aug-2026',
        salaryType: 'Regular',
        basicSalary: 40000,
        da: 20000,
        hra: 9600,
        conveyance: 2000,
        specialAllowance: 2500,
        grossSalary: 74100,
        pfDeduction: 1800,
        esiDeduction: 0,
        tdsDeduction: 2800,
        lwpDeduction: 1538,
        insuranceDeduction: 1000,
        advanceDeduction: 0,
        totalDeductions: 7138,
        netSalary: 66962,
        chequeNo: 'CHQ-SBI-55910',
        chequeDate: new Date('2026-08-30'),
        policyVendor: 'HDFC Life',
        policyNumber: 'HDFC-LIFE-003',
        bankAdviceRef: 'ADV-SBI-2026-03',
        statementGenerated: true,
        status: 'Generated'
      }
    ]);
    console.log('Seeded Monthly Salary Payrolls with Ayup Tech.');

    // 4. Seed IT Head Entries
    await ITHeadEntry.insertMany([
      {
        staffName: 'Ayup Tech',
        employeeId: 'EMP-AT-2026',
        financialYear: '2026-2027',
        itSection: 'Section 80C - Life Insurance & PF',
        declaredAmount: 150000,
        verifiedAmount: 150000,
        maxEligibleAmount: 150000,
        taxSavingBenefit: 30000,
        status: 'Verified',
        remarks: 'Full statutory limit utilized by Ayup Tech'
      },
      {
        staffName: 'Ayup Tech',
        employeeId: 'EMP-AT-2026',
        financialYear: '2026-2027',
        itSection: 'Section 80D - Medical & Health Insurance',
        declaredAmount: 25000,
        verifiedAmount: 25000,
        maxEligibleAmount: 25000,
        taxSavingBenefit: 5000,
        status: 'Verified',
        remarks: 'Self and family medical insurance claim'
      },
      {
        staffName: 'Vikram Sharma',
        employeeId: 'EMP-2026-08',
        financialYear: '2026-2027',
        itSection: 'Section 80C - PPF & ELSS Mutual Funds',
        declaredAmount: 85000,
        verifiedAmount: 85000,
        maxEligibleAmount: 150000,
        taxSavingBenefit: 17000,
        status: 'Verified',
        remarks: 'Verified against investment certificates'
      }
    ]);
    console.log('Seeded IT Head Entries with Ayup Tech.');

    // 5. Seed TDS Remittances
    await TDSRemittance.insertMany([
      {
        staffName: 'Ayup Tech',
        employeeId: 'EMP-AT-2026',
        panNumber: 'AYUPT1234K',
        monthYear: 'Aug-2026',
        grossSalary: 112100,
        taxableSalary: 95000,
        tdsAmount: 5600,
        challanNo: 'CHL-AYUP-2026-01',
        bsrCode: '0210042',
        depositDate: new Date('2026-08-30'),
        chequeNo: 'CHQ-TDS-01',
        schoolBank: 'HDFC Bank - 50100429188',
        status: 'Deposited'
      },
      {
        staffName: 'Ayup Tech Senior Faculty',
        employeeId: 'EMP-AT-2027',
        panNumber: 'AYUPF5678L',
        monthYear: 'Aug-2026',
        grossSalary: 84000,
        taxableSalary: 72000,
        tdsAmount: 3500,
        challanNo: 'CHL-AYUP-2026-02',
        bsrCode: '0210042',
        depositDate: new Date('2026-08-30'),
        chequeNo: 'CHQ-TDS-02',
        schoolBank: 'HDFC Bank - 50100429188',
        status: 'Deposited'
      },
      {
        staffName: 'Vikram Sharma',
        employeeId: 'EMP-2026-08',
        panNumber: 'VKRMS9918M',
        monthYear: 'Aug-2026',
        grossSalary: 74100,
        taxableSalary: 62000,
        tdsAmount: 2800,
        challanNo: 'CHL-SBI-2026-03',
        bsrCode: '0004921',
        depositDate: new Date('2026-08-30'),
        chequeNo: 'CHQ-TDS-03',
        schoolBank: 'State Bank of India - 30291823901',
        status: 'Deposited'
      }
    ]);
    console.log('Seeded TDS Remittances with Ayup Tech.');

    // 6. Seed Gratuity Calculations
    await GratuityCalculation.insertMany([
      {
        staffName: 'Ayup Tech',
        employeeId: 'EMP-AT-2026',
        department: 'Information Technology',
        designation: 'Senior Fullstack Lead',
        joiningDate: new Date('2018-07-01'),
        completedYears: 8,
        lastDrawnBasic: 60000,
        lastDrawnDA: 30000,
        gratuityAmount: 415385,
        statutoryCap: 2000000,
        isEligible: true,
        status: 'Calculated',
        remarks: 'Eligible for statutory gratuity benefits after completing 8 continuous years of service by Ayup Tech.'
      },
      {
        staffName: 'Ayup Tech Senior Faculty',
        employeeId: 'EMP-AT-2027',
        department: 'Computer Science',
        designation: 'Assistant Professor - CS',
        joiningDate: new Date('2020-08-01'),
        completedYears: 6,
        lastDrawnBasic: 45000,
        lastDrawnDA: 22500,
        gratuityAmount: 233654,
        statutoryCap: 2000000,
        isEligible: true,
        status: 'Calculated',
        remarks: 'Eligible for statutory gratuity benefits after completing 6 years of service.'
      },
      {
        staffName: 'Vikram Sharma',
        employeeId: 'EMP-2026-08',
        department: 'Mathematics',
        designation: 'Senior Mathematics Lecturer',
        joiningDate: new Date('2019-06-15'),
        completedYears: 7,
        lastDrawnBasic: 40000,
        lastDrawnDA: 20000,
        gratuityAmount: 242308,
        statutoryCap: 2000000,
        isEligible: true,
        status: 'Calculated',
        remarks: 'Eligible for statutory gratuity benefits.'
      }
    ]);
    console.log('Seeded Gratuity Calculations with Ayup Tech.');

    // 7. Seed Bonus Calculations
    await BonusCalculation.insertMany([
      {
        staffName: 'Ayup Tech',
        employeeId: 'EMP-AT-2026',
        staffType: 'Teaching',
        department: 'Information Technology',
        financialYear: '2026-2027',
        periodFrom: 'Apr-2026',
        periodTo: 'Mar-2027',
        payableMonth: 'Aug-2026',
        eligibleWages: 84000,
        bonusPercentage: 12,
        bonusAmount: 10080,
        status: 'Approved',
        remarks: 'Performance and technical leadership festival bonus for Ayup Tech'
      },
      {
        staffName: 'Ayup Tech Senior Faculty',
        employeeId: 'EMP-AT-2027',
        staffType: 'Teaching',
        department: 'Computer Science',
        financialYear: '2026-2027',
        periodFrom: 'Apr-2026',
        periodTo: 'Mar-2027',
        payableMonth: 'Aug-2026',
        eligibleWages: 84000,
        bonusPercentage: 8.33,
        bonusAmount: 7000,
        status: 'Approved',
        remarks: 'Statutory minimum performance bonus'
      },
      {
        staffName: 'Vikram Sharma',
        employeeId: 'EMP-2026-08',
        staffType: 'Teaching',
        department: 'Mathematics',
        financialYear: '2026-2027',
        periodFrom: 'Apr-2026',
        periodTo: 'Mar-2027',
        payableMonth: 'Aug-2026',
        eligibleWages: 84000,
        bonusPercentage: 8.33,
        bonusAmount: 7000,
        status: 'Approved',
        remarks: 'Statutory minimum performance bonus'
      }
    ]);
    console.log('Seeded Bonus Calculations with Ayup Tech.');

    console.log('\n✅ ALL SALARY STRUCTURE SUB-MODULE DATA SEEDED SUCCESSFULLY WITH "AYUP TECH"!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding salary structure data:', err);
    process.exit(1);
  }
};

seedSalaryStructure();
