const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const TransferCertificate = require('./models/transferCertificateModel');
const BonafideCertificate = require('./models/bonafideCertificateModel');
const StudentCharacteristic = require('./models/studentCharacteristicModel');
const StudentVisa = require('./models/studentVisaModel');
const CbseRegistration = require('./models/cbseRegistrationModel');
const CbseExamConfirmation = require('./models/cbseExamConfirmationModel');

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/naval_school_erp');
    console.log('MongoDB Connected for Certificate seeding.');

    // 1. Seed Transfer Certificates
    await TransferCertificate.deleteMany({});
    await TransferCertificate.insertMany([
      {
        session: '2026-2027',
        board: 'CBSE',
        admissionNo: 'ADM-2026-AAYUP-01',
        name: 'AAYUP KUMAR',
        mother: 'POOJA SHARMA',
        father: 'AAYUP SHARMA',
        dob: '15-Aug-2010',
        class: '10 A',
        section: 'A',
        billNo: 'BL-8800',
        schoolNo: '70211',
        affiliationNo: 'CBSE-2130842',
        address: 'Civil Lines, Gorakhpur, UP',
        contact: '9876543210',
        tcNo: 'TC-2026-001',
        bookNo: 'BK-01',
        slcNo: 'SLC-001',
        srNo: 'SR-1001',
        applyDate: '25-Aug-2026',
        issueDate: '28-Aug-2026',
        status: 'Generated',
        reason: 'Higher Studies in Overseas University',
        conduct: 'Exemplary',
        feePaidUpto: 'March 2027',
        workingDays: '215',
        daysPresent: '210',
        duesCleared: 'Yes',
        failed: 'No',
        subjectsStudied: 'English, Hindi, Mathematics, Physics, Chemistry',
        qualifiedForPromotion: 'Yes',
        feeConcession: 'No',
        nccCadet: 'Yes (Grade A)',
        gamesPlayed: 'Basketball, Swimming',
        extraActivity: 'Debate Champion & President Student Council',
        remarks: 'Outstanding student with all dues cleared'
      },
      {
        session: '2026-2027',
        board: 'CBSE',
        admissionNo: 'ADM-2026-0842',
        name: 'KUSHAL GUPTA',
        mother: 'REKHA GUPTA',
        father: 'ANIL GUPTA',
        dob: '12-May-2010',
        class: '10 B',
        section: 'B',
        billNo: 'BL-8801',
        tcNo: 'TC-2026-002',
        bookNo: 'BK-01',
        slcNo: 'SLC-002',
        applyDate: '25-Aug-2026',
        issueDate: '28-Aug-2026',
        status: 'Generated',
        reason: 'Parent Relocation',
        conduct: 'Good',
        feePaidUpto: 'March 2026',
        workingDays: '210',
        daysPresent: '198',
        duesCleared: 'Yes',
        failed: 'No',
        subjectsStudied: 'English, Mathematics, Science, Social Science',
        qualifiedForPromotion: 'Yes'
      },
      {
        session: '2026-2027',
        board: 'CBSE',
        admissionNo: 'ADM-2026-0910',
        name: 'DIVYANSH SINGH',
        mother: 'PRIYA SINGH',
        father: 'RAJESH SINGH',
        dob: '20-Oct-2010',
        class: '10 B',
        section: 'B',
        billNo: 'BL-8802',
        tcNo: 'TC-2026-003',
        bookNo: 'BK-01',
        slcNo: 'SLC-003',
        applyDate: '26-Aug-2026',
        issueDate: '29-Aug-2026',
        status: 'Generated',
        reason: 'Personal Reasons',
        conduct: 'Very Good',
        feePaidUpto: 'March 2026',
        workingDays: '210',
        daysPresent: '195',
        duesCleared: 'Yes'
      },
      {
        session: '2026-2027',
        board: 'CBSE',
        admissionNo: 'ADM-2026-0328',
        name: 'ARNAV YADAV',
        mother: 'GEETA YADAV',
        father: 'RAMESH YADAV',
        dob: '12-Oct-2009',
        class: '10 A',
        section: 'A',
        billNo: 'BL-9042',
        tcNo: 'DRAFT-TC-004',
        bookNo: 'BK-01',
        applyDate: '01-Sep-2026',
        status: 'Draft',
        reason: 'Parents Transfer',
        conduct: 'Good',
        feePaidUpto: 'March 2026',
        workingDays: '210',
        daysPresent: '198'
      },
      {
        session: '2026-2027',
        board: 'UP Board',
        admissionNo: 'ADM-2026-0156',
        name: 'ANANYA PANDEY',
        mother: 'SANGEETA PANDEY',
        father: 'MANOJ PANDEY',
        dob: '18-Jan-2010',
        class: '10 A',
        section: 'A',
        billNo: 'BL-9043',
        tcNo: 'DRAFT-TC-005',
        bookNo: 'BK-01',
        applyDate: '02-Sep-2026',
        status: 'Draft',
        reason: 'Transfer to UP Board College',
        conduct: 'Good',
        feePaidUpto: 'March 2026',
        workingDays: '210',
        daysPresent: '201'
      },
      {
        session: '2026-2027',
        board: 'CBSE',
        admissionNo: 'ADM-2026-0770',
        name: 'RUDRA PRATAP',
        mother: 'KAVITA PRATAP',
        father: 'VIKRAM PRATAP',
        dob: '05-Sep-2011',
        class: '9 A',
        section: 'A',
        billNo: 'BL-8700',
        tcNo: 'TC-2026-000',
        applyDate: '10-Aug-2026',
        issueDate: '12-Aug-2026',
        cancelDate: '15-Aug-2026',
        cancelReason: 'Student re-admitted on parent request',
        status: 'Cancelled'
      }
    ]);
    console.log('Seeded Transfer Certificates.');

    // 2. Seed Bonafide Certificates
    await BonafideCertificate.deleteMany({});
    await BonafideCertificate.insertMany([
      {
        session: '2026-2027',
        bonafideNo: 'BON/2026/001',
        admissionNo: 'ADM-2026-AAYUP-01',
        studentName: 'AAYUP KUMAR',
        father: 'AAYUP SHARMA',
        mother: 'POOJA SHARMA',
        class: '10 A',
        section: 'A',
        dob: '15-Aug-2010',
        nationality: 'Indian',
        purpose: 'Passport & Visa Documentation',
        character: 'Exemplary',
        remark: 'Bonafide student studying in Class 10 A',
        status: 'Issued'
      },
      {
        session: '2026-2027',
        bonafideNo: 'BON/2026/002',
        admissionNo: 'ADM-2026-0328',
        studentName: 'ARNAV YADAV',
        father: 'RAMESH YADAV',
        mother: 'GEETA YADAV',
        class: '10 A',
        section: 'A',
        dob: '12-Oct-2009',
        nationality: 'Indian',
        purpose: 'National Scholarship Scheme Application',
        character: 'Good',
        remark: 'Active and regular student',
        status: 'Issued'
      }
    ]);
    console.log('Seeded Bonafide Certificates.');

    // 3. Seed Student Characteristics
    await StudentCharacteristic.deleteMany({});
    await StudentCharacteristic.insertMany([
      {
        session: '2026-2027',
        class: '10 A',
        section: 'A',
        admissionNo: 'ADM-2026-AAYUP-01',
        studentName: 'AAYUP KUMAR',
        fatherName: 'AAYUP SHARMA',
        moral: 'Excellent',
        char1: 'Disciplined',
        char2: 'Punctual',
        char3: 'Leadership',
        remark: 'School Head Boy & Academic Topper'
      },
      {
        session: '2026-2027',
        class: '10 A',
        section: 'A',
        admissionNo: 'ADM-2026-0328',
        studentName: 'ARNAV YADAV',
        fatherName: 'RAMESH YADAV',
        moral: 'Good',
        char1: 'Hardworking',
        char2: 'Polite',
        char3: 'Creative',
        remark: 'Consistent learner'
      },
      {
        session: '2026-2027',
        class: '10 A',
        section: 'A',
        admissionNo: 'ADM-2026-0156',
        studentName: 'ANANYA PANDEY',
        fatherName: 'MANOJ PANDEY',
        moral: 'Very Good',
        char1: 'Obedient',
        char2: 'Honest',
        char3: 'Team Player',
        remark: 'Active participant in cultural activities'
      }
    ]);
    console.log('Seeded Student Characteristics.');

    // 4. Seed Student Visa
    await StudentVisa.deleteMany({});
    await StudentVisa.insertMany([
      {
        session: '2026-2027',
        class: '10 A',
        section: 'A',
        admissionNo: 'ADM-2026-AAYUP-01',
        name: 'AAYUP KUMAR',
        vacFrom: '01-Oct-2026',
        vacTo: '15-Oct-2026',
        beforeFrom: '25-Sep-2026',
        beforeTo: '30-Sep-2026',
        afterFrom: '16-Oct-2026',
        afterTo: '20-Oct-2026',
        visaPlace: 'Embassy of Japan, New Delhi',
        joiningDate: '21-Oct-2026',
        remark: 'Approved international academic exchange program'
      },
      {
        session: '2026-2027',
        class: '10 A',
        section: 'A',
        admissionNo: 'ADM-2026-0328',
        name: 'ARNAV YADAV',
        vacFrom: '10-Oct-2026',
        vacTo: '24-Oct-2026',
        beforeFrom: '05-Oct-2026',
        beforeTo: '09-Oct-2026',
        afterFrom: '25-Oct-2026',
        afterTo: '28-Oct-2026',
        visaPlace: 'Embassy of Singapore',
        joiningDate: '29-Oct-2026',
        remark: 'Family vacation'
      }
    ]);
    console.log('Seeded Student Visa details.');

    // 5. Seed CBSE Registrations
    await CbseRegistration.deleteMany({});
    await CbseRegistration.insertMany([
      {
        session: '2026-2027',
        school: 'NAVALS NATIONAL ACADEMY',
        wing: 'Senior Wing',
        class: 'XI',
        section: 'A',
        stream: 'Science (PCM)',
        admissionNo: 'ADM-2026-AAYUP-01',
        name: 'AAYUP KUMAR',
        mother: 'POOJA SHARMA',
        father: 'AAYUP SHARMA',
        dob: '15-Aug-2010',
        regNo: 'R/26/70211/0001',
        subjects: '041, 042, 043, 301, 048',
        status: 'Verified'
      },
      {
        session: '2026-2027',
        school: 'NAVALS NATIONAL ACADEMY',
        wing: 'Senior Wing',
        class: 'IX',
        section: 'A',
        stream: 'General',
        admissionNo: 'ADM-2026-0328',
        name: 'ARNAV YADAV',
        mother: 'GEETA YADAV',
        father: 'RAMESH YADAV',
        dob: '12-Oct-2009',
        regNo: 'R/26/70211/0042',
        subjects: '184, 085, 041, 086, 087',
        status: 'Registered'
      }
    ]);
    console.log('Seeded CBSE Registrations.');

    // 6. Seed CBSE Exam Confirmation (LOC)
    await CbseExamConfirmation.deleteMany({});
    await CbseExamConfirmation.insertMany([
      {
        examinationYear: '2026-2027',
        school: 'NAVALS NATIONAL ACADEMY',
        class: 'X',
        section: 'A',
        admissionNo: 'ADM-2026-AAYUP-01',
        rollNo: '10142800',
        candidateName: 'AAYUP KUMAR',
        mother: 'POOJA SHARMA',
        father: 'AAYUP SHARMA',
        subjects: '184, 085, 041, 086, 087, 402',
        status: 'Confirmed'
      },
      {
        examinationYear: '2026-2027',
        school: 'NAVALS NATIONAL ACADEMY',
        class: 'X',
        section: 'A',
        admissionNo: 'ADM-2026-0328',
        rollNo: '10142801',
        candidateName: 'ARNAV YADAV',
        mother: 'GEETA YADAV',
        father: 'RAMESH YADAV',
        subjects: '184, 085, 041, 086, 087',
        status: 'Confirmed'
      },
      {
        examinationYear: '2026-2027',
        school: 'NAVALS NATIONAL ACADEMY',
        class: 'XII',
        section: 'A',
        admissionNo: 'ADM-2026-0156',
        rollNo: '12142801',
        candidateName: 'ANANYA PANDEY',
        mother: 'SANGEETA PANDEY',
        father: 'MANOJ PANDEY',
        subjects: '301, 041, 042, 043, 048',
        status: 'Confirmed'
      }
    ]);
    console.log('Seeded CBSE Exam Confirmations.');

    await mongoose.disconnect();
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (e) {
    console.error('Seeding error:', e);
    process.exit(1);
  }
}

seedData();
