require('dotenv').config();
const mongoose = require('mongoose');

const SalaryAccount = require('./models/salaryAccountModel');
const SalaryMonth = require('./models/salaryMonthModel');
const Staff = require('./models/staffModel');
const Role = require('./models/roleModel');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    // 1. Seed Salary Accounts (including "Ayup Salary Account")
    await SalaryAccount.deleteMany({});
    const accounts = await SalaryAccount.insertMany([
      {
        accountName: 'Ayup Salary Account',
        bank: 'State Bank of India',
        accountNo: '40928192831',
        branch: 'Civil Lines',
        ifscCode: 'SBIN0001234',
        isActive: true
      },
      {
        accountName: 'HDFC School Operations',
        bank: 'HDFC Bank',
        accountNo: '5010023456789',
        branch: 'Main Branch',
        ifscCode: 'HDFC0000128',
        isActive: true
      },
      {
        accountName: 'PNB Staff A/C',
        bank: 'Punjab National Bank',
        accountNo: '1849000192837',
        branch: 'Mall Road',
        ifscCode: 'PUNB0184900',
        isActive: true
      },
      {
        accountName: 'ICICI Disbursal A/C',
        bank: 'ICICI Bank',
        accountNo: '001205001234',
        branch: 'Tech Park',
        ifscCode: 'ICIC0000012',
        isActive: true
      }
    ]);
    console.log(`✅ Seeded ${accounts.length} Salary Accounts (including 'Ayup Salary Account')`);

    // 2. Seed Salary Months (12 months of Academic Year)
    await SalaryMonth.deleteMany({});
    const monthsData = [
      { orderNo: 1, month: 'April', year: '2026', workingDays: 25, totalDays: 30 },
      { orderNo: 2, month: 'May', year: '2026', workingDays: 26, totalDays: 31 },
      { orderNo: 3, month: 'June', year: '2026', workingDays: 24, totalDays: 30 },
      { orderNo: 4, month: 'July', year: '2026', workingDays: 26, totalDays: 31 },
      { orderNo: 5, month: 'August', year: '2026', workingDays: 25, totalDays: 31 },
      { orderNo: 6, month: 'September', year: '2026', workingDays: 24, totalDays: 30 },
      { orderNo: 7, month: 'October', year: '2026', workingDays: 25, totalDays: 31 },
      { orderNo: 8, month: 'November', year: '2026', workingDays: 24, totalDays: 30 },
      { orderNo: 9, month: 'December', year: '2026', workingDays: 26, totalDays: 31 },
      { orderNo: 10, month: 'January', year: '2027', workingDays: 25, totalDays: 31 },
      { orderNo: 11, month: 'February', year: '2027', workingDays: 23, totalDays: 28 },
      { orderNo: 12, month: 'March', year: '2027', workingDays: 26, totalDays: 31 }
    ];
    const months = await SalaryMonth.insertMany(monthsData);
    console.log(`✅ Seeded ${months.length} Salary Months`);

    // 3. Seed / Update Staff with "Ayup"
    let teacherRole = await Role.findOne({ roleName: 'PRIMARY TEACHERS' });
    if (!teacherRole) {
      teacherRole = await Role.create({ roleName: 'PRIMARY TEACHERS', description: 'Primary Teachers' });
    }

    // Check if Ayup already exists
    let ayupStaff = await Staff.findOne({ userName: 'SF072' });
    const ayupData = {
      prefNo: '72',
      title: 'Mr.',
      firstName: 'Ayup',
      middleName: '',
      lastName: 'Tech',
      userName: 'SF072',
      password: 'password123',
      role: teacherRole._id,
      designation: 'Senior Teacher',
      department: 'PRIMARY TEACHERS',
      qualification: 'Post Graduation',
      staffType: 'PRIMARY TEACHERS',
      salaryAccount: 'Ayup Salary Account',
      dob: new Date('1990-05-15'),
      doj: new Date('2020-07-01'),
      contactNo: '9876543210',
      emailId: 'ayup.tech@schoolsoft.com',
      aadharCardNo: '9876 5432 1098',
      panNumber: 'ABCDE1234F',
      uanNumber: '100987654321',
      bloodGroup: 'O+',
      gender: 'Male',
      category: 'General',
      maritalStatus: 'Married',
      fatherSpouseName: 'Rahim Khan',
      motherName: 'Fatima Begum',
      address: 'House No. 42, Civil Lines, Near Clock Tower',
      nativeAddress: 'Village Kotla, District Nuh',
      basicSalary: 45000,
      gradePay: 4600,
      bankName: 'State Bank of India',
      bankAccNo: '40928192831',
      ifscCode: 'SBIN0001234',
      paymentModes: 'Bank Transfer',
      salaryStatus: 'Active',
      generateSalary: true,
      salaryToBank: true,
      isActive: true,
      salaryHeads: [
        { id: 1, name: 'Dearness Allowance', val: '95.00', type: 'Percentage', selected: true },
        { id: 2, name: 'House Rent Allowance', val: '5.00', type: 'Percentage', selected: true },
        { id: 3, name: 'Transport Allowance', val: '1600.00', type: 'Amount', selected: true },
        { id: 4, name: 'Medical Allowance', val: '75.00', type: 'Amount', selected: true },
        { id: 5, name: 'City expenses', val: '300.00', type: 'Amount', selected: true },
        { id: 11, name: 'Provident Fund', val: '12.00', type: 'Custom', selected: true },
        { id: 12, name: 'Employee State Insurance', val: '1.75', type: 'Percentage', selected: true }
      ],
      educationDetails: [
        { id: 1, qual: '10th', schoolCollege: 'Delhi Public School', boardUniv: 'CBSE', regCorresp: 'Regular', subjects: 'All Subjects', marksPercent: '88%', passingYear: '2006' },
        { id: 2, qual: '12th', schoolCollege: 'Delhi Public School', boardUniv: 'CBSE', regCorresp: 'Regular', subjects: 'PCM', marksPercent: '85%', passingYear: '2008' },
        { id: 3, qual: 'Graduation B.A./B.Sc.', schoolCollege: 'Delhi University', boardUniv: 'DU', regCorresp: 'Regular', subjects: 'Physics (Hons)', marksPercent: '78%', passingYear: '2011' },
        { id: 4, qual: 'B.Ed.', schoolCollege: 'Jamia Millia Islamia', boardUniv: 'JMI', regCorresp: 'Regular', subjects: 'Education, Science', marksPercent: '82%', passingYear: '2013' },
        { id: 5, qual: 'Post Graduation', schoolCollege: 'Delhi University', boardUniv: 'DU', regCorresp: 'Regular', subjects: 'M.Sc. Physics', marksPercent: '80%', passingYear: '2015' }
      ],
      experienceDetails: [
        { id: 1, institutionName: 'Modern Public School', yearFrom: '2015', yearTo: '2020', postHold: 'TGT Science', natureOfJob: 'Permanent', reasonOfLeaving: 'Career Growth' }
      ],
      isTetQualified: true,
      isCtetQualified: true,
      tetExamLevel: 'Level 2',
      childrenDetails: [
        { id: 1, name: 'Zaid Khan', dob: '2021-08-10' }
      ],
      reference1: {
        personName: 'Dr. Mohd Aslam',
        mobileNumber: '9811122233',
        address: 'Delhi University Campus',
        relation: 'Professor / Mentor'
      }
    };

    await Staff.deleteOne({ userName: 'SF072' });
    await Staff.create(ayupData);
    console.log('✅ Created Ayup Tech (SF072) staff record');

    // Ensure other staff also have salaryAccount and staffType set
    await Staff.updateMany(
      { userName: { $ne: 'SF072' }, salaryAccount: { $in: ['', null] } },
      { $set: { salaryAccount: 'HDFC School Operations', staffType: 'Support Staff' } }
    );
    console.log('✅ Updated remaining staff accounts and types for testing');

    console.log('\n🎉 ALL PAYROLL MASTER DATA SEEDED SUCCESSFULLY WITH "AYUP"!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
})();
