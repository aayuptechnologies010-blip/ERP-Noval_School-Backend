const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const {
  IncrementRecord,
  StaffSalaryStructureRecord,
  SalaryStatusRecord,
  DailyWagesRecord
} = require('./models/salaryStructureModel');

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully.');

    // 1. INCREMENT RECORDS
    console.log('Clearing old sample increment records...');
    await IncrementRecord.deleteMany({ staffName: { $regex: /Ayup/i } });

    const increments = [
      {
        staffName: 'Ayup Tech Lead',
        employeeId: 'EMP-AT-001',
        department: 'Information Technology',
        designation: 'Head of Department',
        staffType: 'Teaching',
        salaryAccount: 'Ayup Salary Account',
        schoolBank: 'HDFC Bank - 50100429188',
        incrementType: 'Basic',
        incrementAppliedFrom: 'Aug-2026',
        percentValue: 12,
        amountValue: 0,
        isAmountMode: false,
        activeForArrears: true,
        thisMonthOnly: false,
        previousAmount: 65000,
        incrementAmount: 7800,
        newAmount: 72800,
        status: 'Applied',
        remarks: 'Annual appraisal promotion increment'
      },
      {
        staffName: 'Ayup Sharma',
        employeeId: 'EMP-AT-002',
        department: 'Academics',
        designation: 'Senior Faculty',
        staffType: 'Teaching',
        salaryAccount: 'Ayup Salary Account',
        schoolBank: 'HDFC Bank - 50100429188',
        incrementType: 'DA',
        incrementAppliedFrom: 'Aug-2026',
        percentValue: 8,
        amountValue: 0,
        isAmountMode: false,
        activeForArrears: false,
        thisMonthOnly: false,
        previousAmount: 32000,
        incrementAmount: 2560,
        newAmount: 34560,
        status: 'Applied',
        remarks: 'Statutory DA revision'
      },
      {
        staffName: 'Ayup Verma',
        employeeId: 'EMP-AT-003',
        department: 'Administration',
        designation: 'Administrative Officer',
        staffType: 'Non-Teaching',
        salaryAccount: 'Ayup Primary Account',
        schoolBank: 'SBI Bank - 30219847120',
        incrementType: 'HRA',
        incrementAppliedFrom: 'Jul-2026',
        percentValue: 0,
        amountValue: 4000,
        isAmountMode: true,
        activeForArrears: true,
        thisMonthOnly: false,
        previousAmount: 18000,
        incrementAmount: 4000,
        newAmount: 22000,
        status: 'Applied',
        remarks: 'City allowance head revision'
      },
      {
        staffName: 'Ayup Khan',
        employeeId: 'EMP-AT-004',
        department: 'Information Technology',
        designation: 'System Administrator',
        staffType: 'Non-Teaching',
        salaryAccount: 'Ayup Salary Account',
        schoolBank: 'HDFC Bank - 50100429188',
        incrementType: 'Basic',
        incrementAppliedFrom: 'Jun-2026',
        percentValue: 10,
        amountValue: 0,
        isAmountMode: false,
        activeForArrears: false,
        thisMonthOnly: true,
        previousAmount: 45000,
        incrementAmount: 4500,
        newAmount: 45000,
        status: 'Rolled Back',
        remarks: 'Trial bonus increment rolled back'
      }
    ];
    await IncrementRecord.insertMany(increments);
    console.log(`Inserted ${increments.length} Increment records.`);

    // 2. STAFF SALARY STRUCTURE
    console.log('Clearing old sample staff salary structures...');
    await StaffSalaryStructureRecord.deleteMany({ staffName: { $regex: /Ayup/i } });

    const structures = [
      {
        staffName: 'Ayup Tech Lead',
        employeeId: 'EMP-AT-001',
        department: 'Information Technology',
        designation: 'Head of Department',
        staffType: 'Teaching',
        salaryAccount: 'Ayup Salary Account',
        salaryGroup: 'Group-A',
        basicSalary: 65000,
        da: 32500,
        hra: 13000,
        ta: 4000,
        specialAllowance: 6500,
        grossSalary: 121000,
        pfDeduction: 1800,
        esiDeduction: 0,
        tdsDeduction: 4500,
        insuranceDeduction: 1200,
        totalDeductions: 7500,
        netSalary: 113500,
        effectiveFrom: 'Apr-2026',
        status: 'Active'
      },
      {
        staffName: 'Ayup Sharma',
        employeeId: 'EMP-AT-002',
        department: 'Academics',
        designation: 'Senior Faculty',
        staffType: 'Teaching',
        salaryAccount: 'Ayup Salary Account',
        salaryGroup: 'Group-A',
        basicSalary: 48000,
        da: 24000,
        hra: 9600,
        ta: 3000,
        specialAllowance: 3500,
        grossSalary: 88100,
        pfDeduction: 1800,
        esiDeduction: 0,
        tdsDeduction: 2200,
        insuranceDeduction: 800,
        totalDeductions: 4800,
        netSalary: 83300,
        effectiveFrom: 'Apr-2026',
        status: 'Active'
      },
      {
        staffName: 'Ayup Verma',
        employeeId: 'EMP-AT-003',
        department: 'Administration',
        designation: 'Administrative Officer',
        staffType: 'Non-Teaching',
        salaryAccount: 'Ayup Primary Account',
        salaryGroup: 'Group-B',
        basicSalary: 38000,
        da: 19000,
        hra: 7600,
        ta: 2500,
        specialAllowance: 2000,
        grossSalary: 69100,
        pfDeduction: 1800,
        esiDeduction: 518,
        tdsDeduction: 1200,
        insuranceDeduction: 600,
        totalDeductions: 4118,
        netSalary: 64982,
        effectiveFrom: 'Apr-2026',
        status: 'Active'
      },
      {
        staffName: 'Ayup Khan',
        employeeId: 'EMP-AT-004',
        department: 'Information Technology',
        designation: 'System Administrator',
        staffType: 'Non-Teaching',
        salaryAccount: 'Ayup Salary Account',
        salaryGroup: 'Group-B',
        basicSalary: 35000,
        da: 17500,
        hra: 7000,
        ta: 2500,
        specialAllowance: 2000,
        grossSalary: 64000,
        pfDeduction: 1800,
        esiDeduction: 480,
        tdsDeduction: 1000,
        insuranceDeduction: 500,
        totalDeductions: 3780,
        netSalary: 60220,
        effectiveFrom: 'Apr-2026',
        status: 'Active'
      },
      {
        staffName: 'Ayup Patel',
        employeeId: 'EMP-AT-005',
        department: 'Support Services',
        designation: 'Laboratory Technician',
        staffType: 'Technical',
        salaryAccount: 'Ayup Salary Account',
        salaryGroup: 'Group-C',
        basicSalary: 28000,
        da: 14000,
        hra: 5600,
        ta: 2000,
        specialAllowance: 1500,
        grossSalary: 51100,
        pfDeduction: 1800,
        esiDeduction: 383,
        tdsDeduction: 0,
        insuranceDeduction: 500,
        totalDeductions: 2683,
        netSalary: 48417,
        effectiveFrom: 'Apr-2026',
        status: 'Active'
      }
    ];
    await StaffSalaryStructureRecord.insertMany(structures);
    console.log(`Inserted ${structures.length} Staff Salary Structure records.`);

    // 3. GENERATE SALARY STATUS
    console.log('Clearing old sample salary status records...');
    await SalaryStatusRecord.deleteMany({ staffName: { $regex: /Ayup/i } });

    const statusRecords = [
      {
        staffName: 'Ayup Tech Lead',
        employeeId: 'EMP-AT-001',
        department: 'Information Technology',
        designation: 'Head of Department',
        staffType: 'Teaching',
        salaryAccount: 'Ayup Salary Account',
        schoolBank: 'HDFC Bank - 50100429188',
        monthYear: 'Aug-2026',
        generationStatus: 'Generated',
        generatedOn: new Date(),
        grossSalary: 121000,
        netSalary: 113500,
        remarks: 'Payroll generated & verified successfully'
      },
      {
        staffName: 'Ayup Sharma',
        employeeId: 'EMP-AT-002',
        department: 'Academics',
        designation: 'Senior Faculty',
        staffType: 'Teaching',
        salaryAccount: 'Ayup Salary Account',
        schoolBank: 'HDFC Bank - 50100429188',
        monthYear: 'Aug-2026',
        generationStatus: 'Generated',
        generatedOn: new Date(),
        grossSalary: 88100,
        netSalary: 83300,
        remarks: 'Salary slip generated'
      },
      {
        staffName: 'Ayup Verma',
        employeeId: 'EMP-AT-003',
        department: 'Administration',
        designation: 'Administrative Officer',
        staffType: 'Non-Teaching',
        salaryAccount: 'Ayup Primary Account',
        schoolBank: 'SBI Bank - 30219847120',
        monthYear: 'Aug-2026',
        generationStatus: 'Not Generated',
        generatedOn: null,
        grossSalary: 0,
        netSalary: 0,
        remarks: 'Attendance pending verification'
      },
      {
        staffName: 'Ayup Khan',
        employeeId: 'EMP-AT-004',
        department: 'Information Technology',
        designation: 'System Administrator',
        staffType: 'Non-Teaching',
        salaryAccount: 'Ayup Salary Account',
        schoolBank: 'HDFC Bank - 50100429188',
        monthYear: 'Aug-2026',
        generationStatus: 'Pending',
        generatedOn: null,
        grossSalary: 64000,
        netSalary: 60220,
        remarks: 'Pending HOD approval'
      },
      {
        staffName: 'Ayup Patel',
        employeeId: 'EMP-AT-005',
        department: 'Support Services',
        designation: 'Laboratory Technician',
        staffType: 'Technical',
        salaryAccount: 'Ayup Salary Account',
        schoolBank: 'HDFC Bank - 50100429188',
        monthYear: 'Aug-2026',
        generationStatus: 'Generated',
        generatedOn: new Date(),
        grossSalary: 51100,
        netSalary: 48417,
        remarks: 'Processed via electronic transfer'
      }
    ];
    await SalaryStatusRecord.insertMany(statusRecords);
    console.log(`Inserted ${statusRecords.length} Salary Status records.`);

    // 4. DAILY WAGES ATTENDANCE
    console.log('Clearing old sample daily wages records...');
    await DailyWagesRecord.deleteMany({ staffName: { $regex: /Ayup/i } });

    const dailyWages = [
      {
        staffName: 'Ayup Daily Worker 1',
        employeeId: 'DW-AT-001',
        department: 'Estate & Campus Maintenance',
        designation: 'Maintenance Technician',
        staffType: 'Daily Wages',
        salaryAccount: 'Ayup Salary Account',
        monthYear: 'Aug-2026',
        dailyWageRate: 650,
        totalWorkingDays: 26,
        daysPresent: 25,
        daysAbsent: 1,
        overtimeHours: 12,
        overtimeRate: 90,
        overtimeAmount: 1080,
        grossWages: 17330, // 650*25 + 1080 = 16250 + 1080 = 17330
        deductions: 347,   // 2%
        netWages: 16983,
        status: 'Approved',
        remarks: 'Campus electrical repair & event duty'
      },
      {
        staffName: 'Ayup Daily Worker 2',
        employeeId: 'DW-AT-002',
        department: 'Gardening & Landscaping',
        designation: 'Landscape Assistant',
        staffType: 'Daily Wages',
        salaryAccount: 'Ayup Salary Account',
        monthYear: 'Aug-2026',
        dailyWageRate: 550,
        totalWorkingDays: 26,
        daysPresent: 26,
        daysAbsent: 0,
        overtimeHours: 6,
        overtimeRate: 80,
        overtimeAmount: 480,
        grossWages: 14780, // 550*26 + 480 = 14300 + 480
        deductions: 296,
        netWages: 14484,
        status: 'Approved',
        remarks: 'Sports ground prep and tree pruning'
      },
      {
        staffName: 'Ayup Daily Worker 3',
        employeeId: 'DW-AT-003',
        department: 'Sanitation & Housekeeping',
        designation: 'Senior Cleaner',
        staffType: 'Daily Wages',
        salaryAccount: 'Ayup Primary Account',
        monthYear: 'Aug-2026',
        dailyWageRate: 500,
        totalWorkingDays: 26,
        daysPresent: 24,
        daysAbsent: 2,
        overtimeHours: 4,
        overtimeRate: 75,
        overtimeAmount: 300,
        grossWages: 12300, // 500*24 + 300 = 12000 + 300
        deductions: 246,
        netWages: 12054,
        status: 'Approved',
        remarks: 'Block-A deep cleaning duty'
      },
      {
        staffName: 'Ayup Tech Carpenter',
        employeeId: 'DW-AT-004',
        department: 'Estate & Campus Maintenance',
        designation: 'Furniture Craftsman',
        staffType: 'Daily Wages',
        salaryAccount: 'Ayup Salary Account',
        monthYear: 'Aug-2026',
        dailyWageRate: 700,
        totalWorkingDays: 26,
        daysPresent: 22,
        daysAbsent: 4,
        overtimeHours: 16,
        overtimeRate: 100,
        overtimeAmount: 1600,
        grossWages: 17000, // 700*22 + 1600 = 15400 + 1600
        deductions: 340,
        netWages: 16660,
        status: 'Approved',
        remarks: 'Classroom bench repair and auditorium stage setup'
      }
    ];
    await DailyWagesRecord.insertMany(dailyWages);
    console.log(`Inserted ${dailyWages.length} Daily Wages records.`);

    console.log('✅ ALL 4 COLLECTIONS SEEDED SUCCESSFULLY WITH "AYUP" RECORDS!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedData();
