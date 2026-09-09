const mongoose = require('mongoose');
require('dotenv').config();

const { SalaryPayroll } = require('./models/salaryStructureModel');

const staffTemplates = [
  {
    staffName: 'Ayup Tech Lead',
    employeeId: 'EMP-AT-001',
    department: 'Information Technology',
    designation: 'Senior Lecturer',
    staffType: 'Teaching',
    salaryAccount: 'Ayup Salary Account',
    bankName: 'HDFC Bank',
    bankAccountNo: '501004291881',
    ifscCode: 'HDFC0001234',
    paymentMode: 'Bank Transfer',
    basicSalary: 70000,
    da: 21000,
    hra: 14000,
    conveyance: 6000,
    specialAllowance: 10000,
    grossSalary: 121000,
    pfDeduction: 1800,
    esiDeduction: 0,
    tdsDeduction: 4500,
    lwpDeduction: 0,
    insuranceDeduction: 1200,
    advanceDeduction: 0,
    totalDeductions: 7500,
    netSalary: 113500,
    status: 'Paid',
    panNumber: 'AYUPT1234A',
    doj: '2021-06-15'
  },
  {
    staffName: 'Ayup Sharma',
    employeeId: 'EMP-AT-002',
    department: 'Academics & Mathematics',
    designation: 'PGT Mathematics',
    staffType: 'Teaching',
    salaryAccount: 'Ayup Salary Account',
    bankName: 'State Bank of India',
    bankAccountNo: '30215894102',
    ifscCode: 'SBIN0004521',
    paymentMode: 'Bank Transfer',
    basicSalary: 52000,
    da: 15600,
    hra: 10500,
    conveyance: 4000,
    specialAllowance: 6000,
    grossSalary: 88100,
    pfDeduction: 1800,
    esiDeduction: 0,
    tdsDeduction: 2000,
    lwpDeduction: 0,
    insuranceDeduction: 1000,
    advanceDeduction: 0,
    totalDeductions: 4800,
    netSalary: 83300,
    status: 'Paid',
    panNumber: 'AYUPS2345B',
    doj: '2020-04-10'
  },
  {
    staffName: 'Ayup Verma',
    employeeId: 'EMP-AT-003',
    department: 'Administration & Finance',
    designation: 'Finance Officer',
    staffType: 'Non-Teaching',
    salaryAccount: 'Ayup Salary Account',
    bankName: 'ICICI Bank',
    bankAccountNo: '629401582910',
    ifscCode: 'ICIC0000982',
    paymentMode: 'Bank Transfer',
    basicSalary: 42000,
    da: 12600,
    hra: 8500,
    conveyance: 3000,
    specialAllowance: 3000,
    grossSalary: 69100,
    pfDeduction: 1800,
    esiDeduction: 518,
    tdsDeduction: 1200,
    lwpDeduction: 0,
    insuranceDeduction: 600,
    advanceDeduction: 0,
    totalDeductions: 4118,
    netSalary: 64982,
    status: 'Paid',
    panNumber: 'AYUPV3456C',
    doj: '2022-01-20'
  },
  {
    staffName: 'Ayup Khan',
    employeeId: 'EMP-AT-004',
    department: 'Information Technology',
    designation: 'System Administrator',
    staffType: 'Non-Teaching',
    salaryAccount: 'Ayup Salary Account',
    bankName: 'Punjab National Bank',
    bankAccountNo: '198200010924',
    ifscCode: 'PUNB0198200',
    paymentMode: 'Bank Transfer',
    basicSalary: 38000,
    da: 11400,
    hra: 7600,
    conveyance: 3000,
    specialAllowance: 4000,
    grossSalary: 64000,
    pfDeduction: 1800,
    esiDeduction: 480,
    tdsDeduction: 1000,
    lwpDeduction: 0,
    insuranceDeduction: 500,
    advanceDeduction: 2000,
    totalDeductions: 5780,
    netSalary: 58220,
    status: 'Paid',
    panNumber: 'AYUPK4567D',
    doj: '2022-08-01'
  },
  {
    staffName: 'Ayup Patel',
    employeeId: 'EMP-AT-005',
    department: 'Science & Laboratories',
    designation: 'Lab In-Charge',
    staffType: 'Technical',
    salaryAccount: 'Ayup Salary Account',
    bankName: 'Bank of Baroda',
    bankAccountNo: '2841020000841',
    ifscCode: 'BARB0VISHAL',
    paymentMode: 'Bank Transfer',
    basicSalary: 32000,
    da: 9600,
    hra: 5000,
    conveyance: 2000,
    specialAllowance: 2500,
    grossSalary: 51100,
    pfDeduction: 1800,
    esiDeduction: 383,
    tdsDeduction: 0,
    lwpDeduction: 0,
    insuranceDeduction: 500,
    advanceDeduction: 0,
    totalDeductions: 2683,
    netSalary: 48417,
    status: 'Paid',
    panNumber: 'AYUPP5678E',
    doj: '2023-03-15'
  },
  {
    staffName: 'Ayup Gupta',
    employeeId: 'EMP-AT-006',
    department: 'Academics & Science',
    designation: 'Head of Science',
    staffType: 'Teaching',
    salaryAccount: 'Ayup Salary Account',
    bankName: 'Axis Bank',
    bankAccountNo: '9180200384918',
    ifscCode: 'UTIB0000452',
    paymentMode: 'Bank Transfer',
    basicSalary: 58000,
    da: 17400,
    hra: 11200,
    conveyance: 4000,
    specialAllowance: 5000,
    grossSalary: 95600,
    pfDeduction: 1800,
    esiDeduction: 0,
    tdsDeduction: 3000,
    lwpDeduction: 0,
    insuranceDeduction: 1000,
    advanceDeduction: 0,
    totalDeductions: 5800,
    netSalary: 89800,
    status: 'Paid',
    panNumber: 'AYUPG6789F',
    doj: '2019-07-01'
  },
  {
    staffName: 'Vikram Sharma',
    employeeId: 'EMP-2026-08',
    department: 'Academics & Mathematics',
    designation: 'Senior Faculty',
    staffType: 'Teaching',
    salaryAccount: 'General Salary A/c',
    bankName: 'HDFC Bank',
    bankAccountNo: '50100429188',
    ifscCode: 'HDFC0001234',
    paymentMode: 'Cheque',
    basicSalary: 45000,
    da: 13500,
    hra: 9000,
    conveyance: 3000,
    specialAllowance: 3600,
    grossSalary: 74100,
    pfDeduction: 1800,
    esiDeduction: 556,
    tdsDeduction: 2000,
    lwpDeduction: 0,
    insuranceDeduction: 782,
    advanceDeduction: 2000,
    totalDeductions: 7138,
    netSalary: 66962,
    status: 'Paid',
    panNumber: 'ABCPS1234F',
    doj: '2021-08-10'
  }
];

const months = ['Jul-2026', 'Aug-2026', 'Sep-2026'];

async function seedMonthlyReports() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/erp_school';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB:', mongoUri);

    for (const month of months) {
      for (const tpl of staffTemplates) {
        await SalaryPayroll.findOneAndUpdate(
          { employeeId: tpl.employeeId, monthYear: month },
          {
            ...tpl,
            monthYear: month
          },
          { upsert: true, new: true }
        );
      }
    }

    const count = await SalaryPayroll.countDocuments();
    console.log(`Successfully seeded! Total SalaryPayroll records in DB: ${count}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding monthly salary reports:', error);
    process.exit(1);
  }
}

seedMonthlyReports();
