const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const {
  InterviewType,
  AssessmentType,
  InterviewSlot,
  JobPosting,
  JobApplication,
  SlotAssignment,
  TravelPlan
} = require('./models/recruitmentModel');

async function seedRecruitment() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/erp_school';
    console.log('Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri);

    console.log('=== CLEARING PREVIOUS RECRUITMENT TEST DATA ===');
    await Promise.all([
      InterviewType.deleteMany({}),
      AssessmentType.deleteMany({}),
      InterviewSlot.deleteMany({}),
      JobPosting.deleteMany({}),
      JobApplication.deleteMany({}),
      SlotAssignment.deleteMany({}),
      TravelPlan.deleteMany({})
    ]);

    console.log('=== SEEDING 1. INTERVIEW TYPES ===');
    const interviewTypes = await InterviewType.insertMany([
      {
        typeName: 'Ayup Tech Technical Panel Interview',
        reportName: 'Ayup Tech Engineering Evaluation Report',
        modifyDetails: 'Configured by Ayup Tech Head of Technology',
        status: 'Active'
      },
      {
        typeName: 'HR Culture & Leadership Screening',
        reportName: 'Behavioral & Leadership Rubric',
        modifyDetails: 'Configured by HR Department',
        status: 'Active'
      },
      {
        typeName: 'Classroom Pedagogy & Teaching Demo',
        reportName: 'Academic Demo Scorecard',
        modifyDetails: 'Configured by Academic Director',
        status: 'Active'
      }
    ]);
    console.log(`✅ Seeded ${interviewTypes.length} Interview Types.`);

    console.log('=== SEEDING 2. ASSESSMENT TYPES ===');
    const assessmentTypes = await AssessmentType.insertMany([
      {
        srNo: 1,
        assessmentName: 'Ayup Tech Fullstack Coding & System Design',
        reportName: 'Fullstack Architectural Evaluation Report',
        maxMarks: 100,
        passMarks: 65,
        modifyDetails: 'Created by Ayup Tech Technical Evaluation Board',
        status: 'Active'
      },
      {
        srNo: 2,
        assessmentName: 'CBSE Pedagogy & Subject Competence Test',
        reportName: 'Subject Expertise Evaluation Sheet',
        maxMarks: 50,
        passMarks: 30,
        modifyDetails: 'Created by Academic Inspection Cell',
        status: 'Active'
      },
      {
        srNo: 3,
        assessmentName: 'General Aptitude & Communication Test',
        reportName: 'Communication Assessment Report',
        maxMarks: 50,
        passMarks: 25,
        modifyDetails: 'HR Admissions Panel',
        status: 'Active'
      }
    ]);
    console.log(`✅ Seeded ${assessmentTypes.length} Assessment Types.`);

    console.log('=== SEEDING 3. INTERVIEW SLOTS ===');
    const interviewSlots = await InterviewSlot.insertMany([
      {
        slotName: 'Ayup Tech Executive Morning Slot',
        startTime: '09:30 AM',
        endTime: '11:00 AM',
        slotTime: '09:30 AM - 11:00 AM',
        capacity: 4,
        modifyDetails: 'Configured by Ayup Tech Talent Acquisition',
        status: 'Active'
      },
      {
        slotName: 'Mid-day Technical Screening Slot',
        startTime: '11:30 AM',
        endTime: '01:00 PM',
        slotTime: '11:30 AM - 01:00 PM',
        capacity: 6,
        modifyDetails: 'HR Department',
        status: 'Active'
      },
      {
        slotName: 'Evening Panel Assessment Slot',
        startTime: '03:30 PM',
        endTime: '05:00 PM',
        slotTime: '03:30 PM - 05:00 PM',
        capacity: 5,
        modifyDetails: 'Technical Staff Panel',
        status: 'Active'
      }
    ]);
    console.log(`✅ Seeded ${interviewSlots.length} Interview Slots.`);

    console.log('=== SEEDING 4. JOB POSTINGS ===');
    const jobPostings = await JobPosting.insertMany([
      {
        jobTitle: 'Senior Fullstack Lead - Ayup Tech Labs',
        department: 'Information Technology',
        minExp: 4,
        maxExp: 8,
        qualification: 'MCA / B.Tech in Computer Science or IT',
        vacancies: 2,
        employmentType: 'Full Time',
        ageLimit: '25 - 42 Years',
        annualCtc: '₹10,00,000 - ₹15,00,000 PA',
        skills: 'React.js, Node.js, Express, MongoDB, REST APIs, System Design',
        jobDescription: 'Lead our next-generation ERP platform engineering. Build highly scalable architecture, maintain full-stack master modules, and mentor development teams at Ayup Tech Labs.',
        publishFrom: new Date('2026-08-01'),
        publishTill: new Date('2026-10-31'),
        status: 'Published'
      },
      {
        jobTitle: 'PGT Computer Science & Artificial Intelligence',
        department: 'Academics',
        minExp: 2,
        maxExp: 6,
        qualification: 'MCA / M.Sc Computer Science / B.Tech with B.Ed',
        vacancies: 1,
        employmentType: 'Full Time',
        ageLimit: '24 - 45 Years',
        annualCtc: '₹6,00,000 - ₹8,50,000 PA',
        skills: 'Python, Machine Learning basics, CBSE Senior Secondary Curriculum, MySQL',
        jobDescription: 'Instruct Class XI & XII in Computer Science and Python, mentor student robotics clubs, and organize hackathons.',
        publishFrom: new Date('2026-08-15'),
        publishTill: new Date('2026-11-15'),
        status: 'Published'
      },
      {
        jobTitle: 'Administrative Officer & HR Coordinator',
        department: 'Administration',
        minExp: 3,
        maxExp: 7,
        qualification: 'MBA / Post Graduate Diploma in HR / Administration',
        vacancies: 1,
        employmentType: 'Full Time',
        ageLimit: '26 - 45 Years',
        annualCtc: '₹4,80,000 - ₹6,50,000 PA',
        skills: 'Payroll, Staff Records, statutory compliances, CBSE portal management',
        jobDescription: 'Oversee school human resource operations, attendance management, payroll disbursements, and staff document records.',
        publishFrom: new Date('2026-08-20'),
        publishTill: new Date('2026-10-20'),
        status: 'Published'
      }
    ]);
    console.log(`✅ Seeded ${jobPostings.length} Job Postings.`);

    console.log('=== SEEDING 5. APPLICATIONS RECEIVED ===');
    const ayupJob = jobPostings[0];
    const teacherJob = jobPostings[1];

    const applications = await JobApplication.insertMany([
      {
        jobId: ayupJob._id,
        jobTitle: ayupJob.jobTitle,
        candidateName: 'Ayup Tech Candidate',
        email: 'ayup.candidate@example.com',
        phone: '9876543210',
        qualification: 'MCA (Gold Medalist) - Software Engineering',
        experienceYrs: 6,
        applicationDate: new Date('2026-08-25'),
        currentCtc: '₹10,00,000 PA',
        expectedCtc: '₹13,50,000 PA',
        noticePeriod: '15 Days',
        resumeUrl: '/uploads/resumes/ayup_tech_lead_resume.pdf',
        status: 'Selected',
        round: 'Offer Letter Released',
        offerLetterGenerated: true,
        offerLetterDate: new Date('2026-09-05'),
        offeredSalary: '₹14,00,000 PA',
        remarks: 'Outstanding performance in Ayup Tech technical interview and architecture test'
      },
      {
        jobId: teacherJob._id,
        jobTitle: teacherJob.jobTitle,
        candidateName: 'Dr. Vikram Sharma',
        email: 'vikram.sharma@example.com',
        phone: '9811223344',
        qualification: 'Ph.D in Computer Science, B.Ed',
        experienceYrs: 4,
        applicationDate: new Date('2026-08-28'),
        currentCtc: '₹6,50,000 PA',
        expectedCtc: '₹8,00,000 PA',
        noticePeriod: '30 Days',
        resumeUrl: '/uploads/resumes/vikram_sharma_cv.pdf',
        status: 'Interview Scheduled',
        round: 'Round 1 - Technical Demo',
        offerLetterGenerated: false,
        remarks: 'Scheduled for pedagogy demo session'
      },
      {
        jobId: ayupJob._id,
        jobTitle: ayupJob.jobTitle,
        candidateName: 'Pooja Verma',
        email: 'pooja.verma@example.com',
        phone: '9822334455',
        qualification: 'B.Tech IT',
        experienceYrs: 3,
        applicationDate: new Date('2026-09-02'),
        currentCtc: '₹7,00,000 PA',
        expectedCtc: '₹9,50,000 PA',
        noticePeriod: 'Immediate',
        status: 'Shortlisted',
        round: 'Screening',
        offerLetterGenerated: false,
        remarks: 'Profile under review by tech leads'
      }
    ]);
    console.log(`✅ Seeded ${applications.length} Job Applications.`);

    console.log('=== SEEDING 6. SLOT ASSIGNMENTS ===');
    const ayupCandidate = applications[0];
    const teacherCandidate = applications[1];

    const slotAssignments = await SlotAssignment.insertMany([
      {
        applicationId: ayupCandidate._id,
        candidateName: ayupCandidate.candidateName,
        jobTitle: ayupCandidate.jobTitle,
        interviewTypeId: interviewTypes[0]._id,
        interviewType: interviewTypes[0].typeName,
        interviewSlotId: interviewSlots[0]._id,
        interviewSlot: interviewSlots[0].slotTime,
        interviewDate: new Date('2026-09-03'),
        interviewerName: 'Ayup Tech Technical Advisory Panel',
        venue: 'Tech Boardroom A & Google Meet',
        status: 'Completed',
        feedback: 'Score: 96/100. Excellent mastery of full-stack engineering, microservices, and database tuning.',
        score: 96
      },
      {
        applicationId: teacherCandidate._id,
        candidateName: teacherCandidate.candidateName,
        jobTitle: teacherCandidate.jobTitle,
        interviewTypeId: interviewTypes[2]._id,
        interviewType: interviewTypes[2].typeName,
        interviewSlotId: interviewSlots[1]._id,
        interviewSlot: interviewSlots[1].slotTime,
        interviewDate: new Date('2026-09-10'),
        interviewerName: 'Academic Selection Committee',
        venue: 'Senior Computer Lab 1',
        status: 'Scheduled',
        feedback: 'Teaching demonstration scheduled on Class XII Python Data Structures',
        score: 0
      }
    ]);
    console.log(`✅ Seeded ${slotAssignments.length} Slot Assignments.`);

    console.log('=== SEEDING 7. TRAVEL PLAN APPROVALS ===');
    const travelPlans = await TravelPlan.insertMany([
      {
        candidateName: 'Ayup Tech Candidate',
        empNo: 'REC-AYUP-001',
        purpose: 'On-site Final Technical Demonstration & Offer Signing',
        fromDate: new Date('2026-09-12'),
        toDate: new Date('2026-09-14'),
        sourceCity: 'Bengaluru',
        destinationCity: 'Lucknow',
        modeOfTravel: 'Flight',
        estimatedAmount: 8500,
        approvedAmount: 8500,
        status: 'Approved',
        remarks: 'Approved by Ayup Tech Executive Management for final onboarding'
      },
      {
        candidateName: 'Dr. Vikram Sharma',
        empNo: 'REC-VIC-002',
        purpose: 'Teaching Demonstration Travel Reimbursement',
        fromDate: new Date('2026-09-09'),
        toDate: new Date('2026-09-11'),
        sourceCity: 'Delhi',
        destinationCity: 'Lucknow',
        modeOfTravel: 'Train',
        estimatedAmount: 2400,
        approvedAmount: 2400,
        status: 'Approved',
        remarks: 'AC 2-Tier train fare approved'
      },
      {
        candidateName: 'Rohit Kulkarni',
        empNo: 'REC-ROH-003',
        purpose: 'Initial Screening & Campus Tour',
        fromDate: new Date('2026-09-18'),
        toDate: new Date('2026-09-19'),
        sourceCity: 'Kanpur',
        destinationCity: 'Lucknow',
        modeOfTravel: 'Bus',
        estimatedAmount: 800,
        approvedAmount: 800,
        status: 'Pending',
        remarks: 'Pending verification from HR'
      }
    ]);
    console.log(`✅ Seeded ${travelPlans.length} Travel Plans.`);

    console.log('\n🎉 ALL RECRUITMENT SECTION TEST RECORDS SEEDED WITH "AYUP TECH" SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding recruitment data:', err);
    process.exit(1);
  }
}

seedRecruitment();
