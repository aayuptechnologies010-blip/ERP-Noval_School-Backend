const mongoose = require('mongoose');

// 1. Interview Type Schema
const interviewTypeSchema = new mongoose.Schema({
  typeName: {
    type: String,
    required: [true, 'Interview Type name is required'],
    trim: true
  },
  reportName: {
    type: String,
    default: ''
  },
  modifyDetails: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, { timestamps: true });

// 2. Assessment Type Schema
const assessmentTypeSchema = new mongoose.Schema({
  srNo: {
    type: Number,
    default: 1
  },
  assessmentName: {
    type: String,
    required: [true, 'Assessment Name is required'],
    trim: true
  },
  reportName: {
    type: String,
    default: ''
  },
  maxMarks: {
    type: Number,
    required: [true, 'Assessment Marks are required'],
    default: 100
  },
  passMarks: {
    type: Number,
    default: 40
  },
  modifyDetails: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, { timestamps: true });

// 3. Interview Slot Schema
const interviewSlotSchema = new mongoose.Schema({
  slotName: {
    type: String,
    required: [true, 'Slot Name is required'],
    trim: true
  },
  startTime: {
    type: String,
    default: '10:00 AM'
  },
  endTime: {
    type: String,
    default: '11:30 AM'
  },
  slotTime: {
    type: String,
    default: '10:00 AM - 11:30 AM'
  },
  capacity: {
    type: Number,
    default: 5
  },
  modifyDetails: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, { timestamps: true });

// 4. Job Posting Schema
const jobPostingSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: [true, 'Job Title is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required']
  },
  minExp: {
    type: Number,
    default: 0
  },
  maxExp: {
    type: Number,
    default: 5
  },
  qualification: {
    type: String,
    default: ''
  },
  vacancies: {
    type: Number,
    default: 1
  },
  employmentType: {
    type: String,
    default: 'Full Time'
  },
  ageLimit: {
    type: String,
    default: ''
  },
  annualCtc: {
    type: String,
    default: ''
  },
  skills: {
    type: String,
    default: ''
  },
  jobDescription: {
    type: String,
    default: ''
  },
  publishFrom: {
    type: Date,
    default: Date.now
  },
  publishTill: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Published', 'Draft', 'Closed'],
    default: 'Published'
  }
}, { timestamps: true });

// 5. Job Application Schema (Candidates)
const jobApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPosting'
  },
  jobTitle: {
    type: String,
    required: true
  },
  candidateName: {
    type: String,
    required: [true, 'Candidate Name is required'],
    trim: true
  },
  email: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  qualification: {
    type: String,
    default: ''
  },
  experienceYrs: {
    type: Number,
    default: 0
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  currentCtc: {
    type: String,
    default: ''
  },
  expectedCtc: {
    type: String,
    default: ''
  },
  noticePeriod: {
    type: String,
    default: 'Immediate'
  },
  resumeUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'],
    default: 'Applied'
  },
  round: {
    type: String,
    default: 'Screening'
  },
  offerLetterGenerated: {
    type: Boolean,
    default: false
  },
  offerLetterDate: {
    type: Date
  },
  offeredSalary: {
    type: String,
    default: ''
  },
  remarks: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// 6. Slot Assignment Schema (Scheduled Interviews)
const slotAssignmentSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobApplication'
  },
  candidateName: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    default: ''
  },
  interviewTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewType'
  },
  interviewType: {
    type: String,
    default: 'Technical Interview'
  },
  interviewSlotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewSlot'
  },
  interviewSlot: {
    type: String,
    default: ''
  },
  interviewDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  interviewerName: {
    type: String,
    default: 'Interview Panel'
  },
  venue: {
    type: String,
    default: 'Conference Room / Google Meet'
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'Absent'],
    default: 'Scheduled'
  },
  feedback: {
    type: String,
    default: ''
  },
  score: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// 7. Travel Plan Approval Schema
const travelPlanSchema = new mongoose.Schema({
  candidateName: {
    type: String,
    required: [true, 'Candidate/Staff Name is required'],
    trim: true
  },
  empNo: {
    type: String,
    default: ''
  },
  purpose: {
    type: String,
    default: 'On-site Interview & Demo'
  },
  fromDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  toDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  sourceCity: {
    type: String,
    default: ''
  },
  destinationCity: {
    type: String,
    default: ''
  },
  modeOfTravel: {
    type: String,
    enum: ['Flight', 'Train', 'Bus', 'Taxi', 'Personal Vehicle'],
    default: 'Train'
  },
  estimatedAmount: {
    type: Number,
    default: 0
  },
  approvedAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Reimbursed'],
    default: 'Pending'
  },
  remarks: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const InterviewType = mongoose.model('InterviewType', interviewTypeSchema);
const AssessmentType = mongoose.model('AssessmentType', assessmentTypeSchema);
const InterviewSlot = mongoose.model('InterviewSlot', interviewSlotSchema);
const JobPosting = mongoose.model('JobPosting', jobPostingSchema);
const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);
const SlotAssignment = mongoose.model('SlotAssignment', slotAssignmentSchema);
const TravelPlan = mongoose.model('TravelPlan', travelPlanSchema);

module.exports = {
  InterviewType,
  AssessmentType,
  InterviewSlot,
  JobPosting,
  JobApplication,
  SlotAssignment,
  TravelPlan
};
