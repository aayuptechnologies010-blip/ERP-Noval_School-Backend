require('dotenv').config();
const mongoose = require('mongoose');

const Student = require('./models/studentModel');
const AdmissionSlot = require('./models/admissionSlotModel');
const MeritCriteria = require('./models/meritCriteriaModel');
const MeritList = require('./models/meritListModel');
const SchoolDoc = require('./models/schoolDocModel');
const ParentRequest = require('./models/parentRequestModel');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://aayuptechnologies_db_user:t9a4mbgdpwlGUIzP@cluster0.xkwgx1b.mongodb.net/ERP-NovalSchool?appName=Cluster0';

async function seedData() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully!');

    // 1. Seed or update Aayup Kumar student
    console.log('Seeding student data with Aayup...');
    const aayupExisting = await Student.findOne({
      $or: [
        { 'academicDetails.admissionNumber': 'ADM-2026-AAYUP-01' },
        { 'personalDetails.firstName': 'Aayup' }
      ]
    });

    let aayupStudentId;
    if (aayupExisting) {
      aayupExisting.personalDetails.firstName = 'Aayup';
      aayupExisting.personalDetails.lastName = 'Kumar';
      aayupExisting.personalDetails.gender = 'Male';
      aayupExisting.personalDetails.dateOfBirth = new Date('2021-05-15');
      aayupExisting.academicDetails.admissionNumber = 'ADM-2026-AAYUP-01';
      aayupExisting.academicDetails.class = 'NUR';
      aayupExisting.academicDetails.section = 'A';
      aayupExisting.academicDetails.rollNumber = '1';
      aayupExisting.academicDetails.currentStatus = 'STUDYING';
      aayupExisting.familyDetails.father.firstName = 'Aayup';
      aayupExisting.familyDetails.father.lastName = 'Sharma';
      aayupExisting.familyDetails.father.title = 'Mr.';
      aayupExisting.familyDetails.father.mobile = '9876543210';
      aayupExisting.familyDetails.mother.firstName = 'Pooja';
      aayupExisting.familyDetails.mother.lastName = 'Sharma';
      aayupExisting.familyDetails.mother.title = 'Mrs.';
      aayupExisting.familyDetails.mother.mobile = '9876543211';
      await aayupExisting.save();
      aayupStudentId = aayupExisting._id;
      console.log('Updated existing student Aayup Kumar:', aayupStudentId);
    } else {
      const newAayup = new Student({
        personalDetails: {
          firstName: 'Aayup',
          lastName: 'Kumar',
          gender: 'Male',
          dateOfBirth: new Date('2021-05-15'),
          nationality: 'Indian',
          religion: 'Hindu',
          category: 'General'
        },
        academicDetails: {
          admissionNumber: 'ADM-2026-AAYUP-01',
          class: 'NUR',
          section: 'A',
          rollNumber: '1',
          currentStatus: 'STUDYING',
          dateOfAdmission: new Date('2026-04-01')
        },
        familyDetails: {
          father: {
            title: 'Mr.',
            firstName: 'Aayup',
            lastName: 'Sharma',
            mobile: '9876543210',
            profession: 'Business'
          },
          mother: {
            title: 'Mrs.',
            firstName: 'Pooja',
            lastName: 'Sharma',
            mobile: '9876543211'
          }
        },
        contactDetails: {
          mobileNumber: '9876543210',
          presentAddress: {
            addressLine1: 'Flat 402, Royal Residency, Gomti Nagar',
            city: 'Lucknow',
            state: 'Uttar Pradesh',
            pincode: '226010'
          }
        }
      });
      const created = await newAayup.save();
      aayupStudentId = created._id;
      console.log('Created student Aayup Kumar:', aayupStudentId);
    }

    // Ensure peer students exist for NUR-A
    const peerNames = [
      { first: 'AARAV', last: 'GUPTA', father: 'RAMESH GUPTA', adm: '2001' },
      { first: 'ANANYA', last: 'PANDEY', father: 'MANOJ PANDEY', adm: '2002' },
      { first: 'ADITYA', last: 'SINGH', father: 'RAJESH SINGH', adm: '2003' },
      { first: 'RIYA', last: 'VERMA', father: 'SUNIL VERMA', adm: '2004' },
      { first: 'SHIVAM', last: 'TIWARI', father: 'ASHOK TIWARI', adm: '2005' },
      { first: 'AVANI', last: 'CHAUBEY', father: 'DINESH CHAUBEY', adm: '2006' }
    ];

    for (const p of peerNames) {
      const exists = await Student.findOne({ 'academicDetails.admissionNumber': p.adm });
      if (!exists) {
        await Student.create({
          personalDetails: { firstName: p.first, lastName: p.last, gender: 'Male', nationality: 'Indian' },
          academicDetails: { admissionNumber: p.adm, class: 'NUR', section: 'A', currentStatus: 'STUDYING' },
          familyDetails: { father: { title: 'Mr.', firstName: p.father, mobile: '9876500000' }, mother: { title: 'Mrs.', firstName: 'Mother' } }
        });
      }
    }

    // 2. Seed Merit Criteria
    console.log('Seeding Merit Criteria...');
    const defaultCriteria = [
      { name: 'Academic Performance (Previous Class)', maxPoint: 40, session: '2026-2027', description: 'Evaluation of previous marks / foundational test' },
      { name: 'Entrance Assessment / Interview', maxPoint: 30, session: '2026-2027', description: 'Oral and interaction score' },
      { name: 'Sibling / Alumni Point', maxPoint: 15, session: '2026-2027', description: 'Points for alumni or siblings currently enrolled' },
      { name: 'Distance / Proximity Criteria', maxPoint: 15, session: '2026-2027', description: 'Residence within 5-10 km radius' }
    ];

    for (const c of defaultCriteria) {
      const exists = await MeritCriteria.findOne({ name: c.name, session: c.session });
      if (!exists) {
        await MeritCriteria.create(c);
      }
    }

    // 3. Seed Admission Slots with Aayup as an applicant
    console.log('Seeding Admission Slots...');
    await AdmissionSlot.deleteMany({ session: '2026-2027' });

    const slots = [
      {
        slotName: 'SLOT-1 (Morning Aayup Wing)',
        session: '2026-2027',
        class: 'NUR',
        slotDate: '10-Sep-2026',
        startTime: '09:00 AM',
        endTime: '11:00 AM',
        maxApplicants: 25,
        allottedApplicants: 4,
        location: 'Room 101 - Main Wing',
        status: 'Active',
        applicants: [
          {
            studentId: aayupStudentId,
            admissionNo: 'ADM-2026-AAYUP-01',
            studentName: 'Aayup Kumar',
            fatherName: 'Aayup Sharma',
            class: 'NUR',
            points: 66,
            criteriaPoints: { academic: 38, interview: 28 },
            status: 'Allotted'
          },
          {
            admissionNo: '2001',
            studentName: 'AARAV GUPTA',
            fatherName: 'RAMESH GUPTA',
            class: 'NUR',
            points: 60,
            criteriaPoints: { academic: 34, interview: 26 },
            status: 'Allotted'
          },
          {
            admissionNo: '2002',
            studentName: 'ANANYA PANDEY',
            fatherName: 'MANOJ PANDEY',
            class: 'NUR',
            points: 58,
            criteriaPoints: { academic: 32, interview: 26 },
            status: 'Allotted'
          },
          {
            admissionNo: '2003',
            studentName: 'ADITYA SINGH',
            fatherName: 'RAJESH SINGH',
            class: 'NUR',
            points: 55,
            criteriaPoints: { academic: 30, interview: 25 },
            status: 'Allotted'
          }
        ]
      },
      {
        slotName: 'SLOT-2 (Noon)',
        session: '2026-2027',
        class: 'NUR',
        slotDate: '10-Sep-2026',
        startTime: '12:00 PM',
        endTime: '02:00 PM',
        maxApplicants: 25,
        allottedApplicants: 2,
        location: 'Room 102 - Junior Wing',
        status: 'Active',
        applicants: [
          {
            admissionNo: '2004',
            studentName: 'RIYA VERMA',
            fatherName: 'SUNIL VERMA',
            class: 'NUR',
            points: 59,
            criteriaPoints: { academic: 35, interview: 24 },
            status: 'Allotted'
          },
          {
            admissionNo: '2005',
            studentName: 'SHIVAM TIWARI',
            fatherName: 'ASHOK TIWARI',
            class: 'NUR',
            points: 54,
            criteriaPoints: { academic: 30, interview: 24 },
            status: 'Allotted'
          }
        ]
      },
      {
        slotName: 'SLOT-3 (Afternoon)',
        session: '2026-2027',
        class: 'NUR',
        slotDate: '11-Sep-2026',
        startTime: '03:00 PM',
        endTime: '05:00 PM',
        maxApplicants: 30,
        allottedApplicants: 1,
        location: 'Auditorium Hall',
        status: 'Active',
        applicants: [
          {
            admissionNo: '2006',
            studentName: 'AVANI CHAUBEY',
            fatherName: 'DINESH CHAUBEY',
            class: 'NUR',
            points: 57,
            criteriaPoints: { academic: 33, interview: 24 },
            status: 'Allotted'
          }
        ]
      }
    ];

    for (const s of slots) {
      await AdmissionSlot.create(s);
    }
    console.log('Slots seeded successfully!');

    // 4. Seed Merit Lists
    console.log('Seeding Merit Lists...');
    await MeritList.deleteMany({});
    const meritLists = [
      {
        name: 'Merit List 1 (General)',
        session: '2026-2027',
        class: 'NUR',
        fromDate: '01-Sep-2026',
        toDate: '15-Sep-2026',
        minPoint: 55,
        applicantLimit: 30,
        applicant: 25,
        allotted: 20,
        status: 'Active',
        applicants: [
          {
            studentId: aayupStudentId,
            admissionNo: 'ADM-2026-AAYUP-01',
            studentName: 'Aayup Kumar',
            fatherName: 'Aayup Sharma',
            class: 'NUR',
            totalPoints: 68,
            rank: 1,
            status: 'Selected'
          },
          {
            admissionNo: '2001',
            studentName: 'AARAV GUPTA',
            fatherName: 'RAMESH GUPTA',
            class: 'NUR',
            totalPoints: 64,
            rank: 2,
            status: 'Selected'
          },
          {
            admissionNo: '2004',
            studentName: 'RIYA VERMA',
            fatherName: 'SUNIL VERMA',
            class: 'NUR',
            totalPoints: 62,
            rank: 3,
            status: 'Selected'
          },
          {
            admissionNo: '2002',
            studentName: 'ANANYA PANDEY',
            fatherName: 'MANOJ PANDEY',
            class: 'NUR',
            totalPoints: 60,
            rank: 4,
            status: 'Selected'
          },
          {
            admissionNo: '2006',
            studentName: 'AVANI CHAUBEY',
            fatherName: 'DINESH CHAUBEY',
            class: 'NUR',
            totalPoints: 58,
            rank: 5,
            status: 'Selected'
          }
        ]
      },
      {
        name: 'Merit List 2 (Waiting List)',
        session: '2026-2027',
        class: 'NUR',
        fromDate: '16-Sep-2026',
        toDate: '25-Sep-2026',
        minPoint: 50,
        applicantLimit: 15,
        applicant: 12,
        allotted: 8,
        status: 'Active',
        applicants: [
          {
            admissionNo: '2003',
            studentName: 'ADITYA SINGH',
            fatherName: 'RAJESH SINGH',
            class: 'NUR',
            totalPoints: 54,
            rank: 6,
            status: 'Waiting'
          },
          {
            admissionNo: '2005',
            studentName: 'SHIVAM TIWARI',
            fatherName: 'ASHOK TIWARI',
            class: 'NUR',
            totalPoints: 52,
            rank: 7,
            status: 'Waiting'
          }
        ]
      }
    ];

    for (const m of meritLists) {
      await MeritList.create(m);
    }
    console.log('Merit lists seeded successfully!');

    // 5. Seed School Documents
    console.log('Seeding School Documents...');
    const schoolDocs = [
      { type: 'School Affiliation Certificate (CBSE/UP Board)', documentName: 'affiliation_cert_2026.pdf', status: 'Verified' },
      { type: 'Building Safety & Structural Stability Certificate', documentName: 'building_safety_cert.pdf', status: 'Verified' },
      { type: 'Fire Safety & NOC Certificate', documentName: 'fire_noc_2026.pdf', status: 'Verified' },
      { type: 'Safe Drinking Water & Sanitary Condition Certificate', documentName: 'sanitation_cert.pdf', status: 'Verified' },
      { type: 'Land Certificate / Ownership Deed', documentName: 'land_deed_document.pdf', status: 'Verified' }
    ];

    for (const d of schoolDocs) {
      const exists = await SchoolDoc.findOne({ type: d.type });
      if (!exists) {
        await SchoolDoc.create(d);
      }
    }
    console.log('School documents verified!');

    // 6. Seed Parent Change Requests with Aayup Sharma
    console.log('Seeding Parent Requests...');
    await ParentRequest.deleteMany({});
    const parentRequests = [
      {
        studentName: 'Aayup Kumar',
        admissionNo: 'ADM-2026-AAYUP-01',
        class: 'NUR',
        section: 'A',
        fatherName: 'Aayup Sharma',
        motherName: 'Pooja Sharma',
        mobile: '9876543210',
        requestType: 'Mobile & Address Change',
        currentValue: '123 Vikas Nagar, Lucknow',
        requestedValue: 'Flat 402, Royal Residency, Gomti Nagar, Lucknow',
        reason: 'Relocated to permanent house in Gomti Nagar',
        status: 'Pending',
        requestedDate: '05-Sep-2026'
      },
      {
        studentName: 'Aayup Kumar',
        admissionNo: 'ADM-2026-AAYUP-01',
        class: 'NUR',
        section: 'A',
        fatherName: 'Aayup Sharma',
        motherName: 'Pooja Sharma',
        mobile: '9876543210',
        requestType: 'Bus Route Change',
        currentValue: 'Route 2 - Vikas Nagar Stop',
        requestedValue: 'Route 5 - Gomti Nagar Main Stop',
        reason: 'Change in pick-up location due to house relocation',
        status: 'Pending',
        requestedDate: '06-Sep-2026'
      },
      {
        studentName: 'AARAV GUPTA',
        admissionNo: '2001',
        class: 'NUR',
        section: 'A',
        fatherName: 'RAMESH GUPTA',
        motherName: 'SUNITA GUPTA',
        mobile: '9839011223',
        requestType: 'Father Contact Update',
        currentValue: '9839011220',
        requestedValue: '9839011223',
        reason: 'Primary contact lost and updated',
        status: 'Pending',
        requestedDate: '04-Sep-2026'
      },
      {
        studentName: 'ANANYA PANDEY',
        admissionNo: '2002',
        class: 'NUR',
        section: 'A',
        fatherName: 'MANOJ PANDEY',
        motherName: 'PRIYA PANDEY',
        mobile: '9839012345',
        requestType: 'Blood Group Correction',
        currentValue: 'B+',
        requestedValue: 'O+',
        reason: 'Hospital pathology verification attached',
        status: 'Pending',
        requestedDate: '02-Sep-2026'
      },
      {
        studentName: 'Aayup Kumar',
        admissionNo: 'ADM-2026-AAYUP-01',
        class: 'NUR',
        section: 'A',
        fatherName: 'Aayup Sharma',
        motherName: 'Pooja Sharma',
        mobile: '9876543210',
        requestType: 'Mother Name Spelling Correction',
        currentValue: 'Puja Sharma',
        requestedValue: 'Pooja Sharma',
        reason: 'Matches official Aadhaar card spelling',
        status: 'Approved',
        requestedDate: '01-Sep-2026'
      }
    ];

    for (const pr of parentRequests) {
      await ParentRequest.create(pr);
    }
    console.log('Parent requests seeded successfully!');

    console.log('\n--- ALL ADMISSION SEED DATA POPULATED SUCCESSFULLY ---');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedData();
