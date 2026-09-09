const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const { TDSRemittance, ITHeadEntry, SalaryPayroll } = require('./models/salaryStructureModel');

const seedIncomeTaxData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected.');

    console.log('Clearing old Ayup TDSRemittance & ITHeadEntry records...');
    await TDSRemittance.deleteMany({ staffName: { $regex: /Ayup/i } });
    await ITHeadEntry.deleteMany({ staffName: { $regex: /Ayup/i } });

    // 1. Fetch current Ayup payrolls for reference
    const ayupStaff = [
      {
        name: 'Ayup Tech Lead',
        empId: 'EMP-AT-001',
        pan: 'AYUPT1234A',
        dept: 'Information Technology',
        desig: 'Head of Department & Tech Lead',
        staffType: 'Teaching',
        gross: 121000,
        tds: 4500,
        bank: 'HDFC Bank - 50100429188'
      },
      {
        name: 'Ayup Sharma',
        empId: 'EMP-AT-002',
        pan: 'AYUPS2345B',
        dept: 'Academics & Mathematics',
        desig: 'Senior Faculty',
        staffType: 'Teaching',
        gross: 88100,
        tds: 2200,
        bank: 'SBI Bank - 30219847120'
      },
      {
        name: 'Ayup Verma',
        empId: 'EMP-AT-003',
        pan: 'AYUPV3456C',
        dept: 'Administration & Finance',
        desig: 'Administrative Officer',
        staffType: 'Non-Teaching',
        gross: 69100,
        tds: 1500,
        bank: 'HDFC Bank - 50100429188'
      },
      {
        name: 'Ayup Khan',
        empId: 'EMP-AT-004',
        pan: 'AYUPK4567D',
        dept: 'Infrastructure & Systems',
        desig: 'System Administrator',
        staffType: 'Technical',
        gross: 64000,
        tds: 1200,
        bank: 'ICICI Bank - 00210599182'
      },
      {
        name: 'Ayup Patel',
        empId: 'EMP-AT-005',
        pan: 'AYUPP5678E',
        dept: 'Science & Laboratories',
        desig: 'Senior Lab In-charge',
        staffType: 'Technical',
        gross: 51100,
        tds: 800,
        bank: 'PNB - 01920021008'
      },
      {
        name: 'Ayup Gupta',
        empId: 'EMP-AT-006',
        pan: 'AYUPG6789F',
        dept: 'Academics & Research',
        desig: 'Assistant Professor',
        staffType: 'Teaching',
        gross: 95600,
        tds: 2800,
        bank: 'HDFC Bank - 50100429188'
      }
    ];

    // Seed TDSRemittance for Aug-2026, Jul-2026, Jun-2026
    const months = [
      { m: 'Aug-2026', bsr: '0210042', chlPrefix: 'CHL-202608', date: new Date('2026-09-07') },
      { m: 'Jul-2026', bsr: '0210042', chlPrefix: 'CHL-202607', date: new Date('2026-08-07') },
      { m: 'Jun-2026', bsr: '0210042', chlPrefix: 'CHL-202606', date: new Date('2026-07-07') }
    ];

    const tdsDocs = [];
    for (const mon of months) {
      for (let i = 0; i < ayupStaff.length; i++) {
        const s = ayupStaff[i];
        tdsDocs.push({
          staffName: s.name,
          employeeId: s.empId,
          panNumber: s.pan,
          monthYear: mon.m,
          grossSalary: s.gross,
          taxableSalary: Math.max(0, s.gross - 12000 - 4166),
          tdsAmount: s.tds,
          challanNo: `${mon.chlPrefix}-${8820 + i}`,
          bsrCode: mon.bsr,
          depositDate: mon.date,
          chequeNo: `CHQ-TDS-${mon.m.slice(0, 3)}-${i + 1}`,
          schoolBank: s.bank,
          status: 'Deposited'
        });
      }
    }

    const insertedTds = await TDSRemittance.insertMany(tdsDocs);
    console.log(`Successfully seeded ${insertedTds.length} TDSRemittance records for Ayup staff!`);

    // Seed ITHeadEntry (Tax Investment Declarations u/s 80C, 80D, 80CCD, etc.)
    const itDocs = [];
    for (const s of ayupStaff) {
      // 80C
      itDocs.push({
        staffName: s.name,
        employeeId: s.empId,
        financialYear: '2026-2027',
        itSection: 'Section 80C - Provident Fund, PPF & Life Insurance',
        declaredAmount: 150000,
        verifiedAmount: 150000,
        maxEligibleAmount: 150000,
        taxSavingBenefit: 30000,
        status: 'Verified',
        remarks: 'Form 12BB verified with LIC receipts & School PF'
      });
      // 80D
      itDocs.push({
        staffName: s.name,
        employeeId: s.empId,
        financialYear: '2026-2027',
        itSection: 'Section 80D - Mediclaim & Health Insurance Premium',
        declaredAmount: 25000,
        verifiedAmount: 25000,
        maxEligibleAmount: 25000,
        taxSavingBenefit: 5000,
        status: 'Verified',
        remarks: 'Star Health Group Insurance receipt approved'
      });
      // 80CCD(1B)
      itDocs.push({
        staffName: s.name,
        employeeId: s.empId,
        financialYear: '2026-2027',
        itSection: 'Section 80CCD(1B) - National Pension System (NPS)',
        declaredAmount: 50000,
        verifiedAmount: 50000,
        maxEligibleAmount: 50000,
        taxSavingBenefit: 10000,
        status: 'Verified',
        remarks: 'PRAN Statement Verified'
      });
    }

    const insertedIT = await ITHeadEntry.insertMany(itDocs);
    console.log(`Successfully seeded ${insertedIT.length} ITHeadEntry declarations for Ayup staff!`);

    console.log('ALL INCOME TAX DATA SEEDED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding income tax data:', err);
    process.exit(1);
  }
};

seedIncomeTaxData();
