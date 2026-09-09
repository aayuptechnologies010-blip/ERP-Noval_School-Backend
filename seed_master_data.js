require('dotenv').config();
const mongoose = require('mongoose');

const StaffType = require('./models/stafftypeModel');
const Department = require('./models/departmentModel');
const Designation = require('./models/designationModel');
const Qualification = require('./models/qualificationModel');
const StaffDocumentType = require('./models/staffdocumenttypeModel');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    await Promise.all([
      StaffType.deleteMany({}),
      Department.deleteMany({}),
      Designation.deleteMany({}),
      Qualification.deleteMany({}),
      StaffDocumentType.deleteMany({})
    ]);

    await StaffType.insertMany([
      { type: 'Management', hourly: false, showEcare: true },
      { type: 'Support Staff', hourly: false, showEcare: true },
      { type: 'PRIMARY TEACHERS', hourly: false, showEcare: true },
      { type: 'PRE-PRIM. TEACHERS', hourly: false, showEcare: true },
      { type: 'TEACHERS', hourly: false, showEcare: true },
      { type: 'Front Office/Accounts', hourly: false, showEcare: true },
      { type: 'OTHER', hourly: false, showEcare: false },
      { type: 'ADHOC', hourly: false, showEcare: false },
      { type: 'NON TEACHING', hourly: false, showEcare: false },
      { type: 'Cont Emp', hourly: true, showEcare: true },
    ]);

    await Department.insertMany([
      { type: 'ADMINITRATION DEPT.' },
      { type: 'OFFICE STAFF' },
      { type: 'NON-TEACHING STAFF' },
      { type: 'PRE-PRIMARY TEACHERS' },
      { type: 'PRIMARY TEACHERS' },
      { type: 'SENIOR TEACHERS' },
      { type: 'MIDDLE SECTION TEACHER' }
    ]);

    await Designation.insertMany([
      { type: 'Manager', showPayroll: true },
      { type: 'Bank ManagerS', showPayroll: false },
      { type: 'BUSINESS MAN', showPayroll: false },
      { type: 'HOUSE WIFE', showPayroll: false },
      { type: 'TEACHER1', showPayroll: true },
      { type: 'Principal', showPayroll: true },
      { type: 'Officer', showPayroll: true },
      { type: 'DOCTOR', showPayroll: false },
      { type: 'Dentist', showPayroll: false },
      { type: 'Army Officer', showPayroll: false },
    ]);

    await Qualification.insertMany([
      { type: '10th' },
      { type: '12th' },
      { type: 'Graduation B.A./B.Sc.' },
      { type: 'B.Ed.' },
      { type: 'Post Graduation' }
    ]);

    await StaffDocumentType.insertMany([
      { type: 'Aadhar Card' },
      { type: 'PAN Card' },
      { type: 'Voter ID' },
      { type: 'Passport' },
      { type: 'Driving License' }
    ]);

    console.log('✅ Seeded master data successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
