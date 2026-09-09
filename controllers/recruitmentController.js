const {
  InterviewType,
  AssessmentType,
  InterviewSlot,
  JobPosting,
  JobApplication,
  SlotAssignment,
  TravelPlan
} = require('../models/recruitmentModel');

// ==================== 1. INTERVIEW TYPES ====================
const getInterviewTypes = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};
    if (status && status !== 'All') query.status = status;
    if (search) {
      query.$or = [
        { typeName: { $regex: search, $options: 'i' } },
        { reportName: { $regex: search, $options: 'i' } }
      ];
    }
    const types = await InterviewType.find(query).sort({ createdAt: -1 });
    res.json(types);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createInterviewType = async (req, res) => {
  try {
    const { typeName, reportName, modifyDetails, status } = req.body;
    if (!typeName) return res.status(400).json({ message: 'Interview Type Name is required' });

    const item = await InterviewType.create({
      typeName: typeName.trim(),
      reportName: reportName || '',
      modifyDetails: modifyDetails || 'Created via Admin',
      status: status || 'Active'
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateInterviewType = async (req, res) => {
  try {
    const item = await InterviewType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Interview Type not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteInterviewType = async (req, res) => {
  try {
    const item = await InterviewType.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Interview Type not found' });
    res.json({ message: 'Interview Type deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ==================== 2. ASSESSMENT TYPES ====================
const getAssessmentTypes = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};
    if (status && status !== 'All') query.status = status;
    if (search) {
      query.$or = [
        { assessmentName: { $regex: search, $options: 'i' } },
        { reportName: { $regex: search, $options: 'i' } }
      ];
    }
    const assessments = await AssessmentType.find(query).sort({ srNo: 1, createdAt: -1 });
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createAssessmentType = async (req, res) => {
  try {
    const { srNo, assessmentName, reportName, maxMarks, passMarks, modifyDetails, status } = req.body;
    if (!assessmentName) return res.status(400).json({ message: 'Assessment Name is required' });

    const count = await AssessmentType.countDocuments();
    const item = await AssessmentType.create({
      srNo: Number(srNo) || count + 1,
      assessmentName: assessmentName.trim(),
      reportName: reportName || '',
      maxMarks: Number(maxMarks) || 100,
      passMarks: Number(passMarks) || 40,
      modifyDetails: modifyDetails || 'Created via Admin',
      status: status || 'Active'
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateAssessmentType = async (req, res) => {
  try {
    const item = await AssessmentType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Assessment Type not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteAssessmentType = async (req, res) => {
  try {
    const item = await AssessmentType.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Assessment Type not found' });
    res.json({ message: 'Assessment Type deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ==================== 3. INTERVIEW SLOTS ====================
const getInterviewSlots = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};
    if (status && status !== 'All') query.status = status;
    if (search) {
      query.$or = [
        { slotName: { $regex: search, $options: 'i' } },
        { slotTime: { $regex: search, $options: 'i' } }
      ];
    }
    const slots = await InterviewSlot.find(query).sort({ createdAt: -1 });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createInterviewSlot = async (req, res) => {
  try {
    const { slotName, startTime, endTime, slotTime, capacity, modifyDetails, status } = req.body;
    if (!slotName) return res.status(400).json({ message: 'Slot Name is required' });

    const finalSlotTime = slotTime || `${startTime || '10:00 AM'} - ${endTime || '11:30 AM'}`;
    const item = await InterviewSlot.create({
      slotName: slotName.trim(),
      startTime: startTime || '10:00 AM',
      endTime: endTime || '11:30 AM',
      slotTime: finalSlotTime,
      capacity: Number(capacity) || 5,
      modifyDetails: modifyDetails || 'Created via Admin',
      status: status || 'Active'
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateInterviewSlot = async (req, res) => {
  try {
    const { startTime, endTime, slotTime } = req.body;
    if (startTime && endTime && !slotTime) {
      req.body.slotTime = `${startTime} - ${endTime}`;
    }
    const item = await InterviewSlot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Interview Slot not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteInterviewSlot = async (req, res) => {
  try {
    const item = await InterviewSlot.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Interview Slot not found' });
    res.json({ message: 'Interview Slot deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ==================== 4. JOB POSTINGS ====================
const getJobPostings = async (req, res) => {
  try {
    const { search, department, status } = req.query;
    const query = {};
    if (status && status !== 'All') query.status = status;
    if (department && department !== 'All') query.department = department;
    if (search) {
      query.$or = [
        { jobTitle: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }
    const jobs = await JobPosting.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createJobPosting = async (req, res) => {
  try {
    const {
      jobTitle, department, minExp, maxExp, qualification, vacancies,
      employmentType, ageLimit, annualCtc, skills, jobDescription,
      publishFrom, publishTill, status
    } = req.body;

    if (!jobTitle || !department) {
      return res.status(400).json({ message: 'Job Title and Department are required' });
    }

    const job = await JobPosting.create({
      jobTitle: jobTitle.trim(),
      department: department.trim(),
      minExp: Number(minExp) || 0,
      maxExp: Number(maxExp) || 5,
      qualification: qualification || '',
      vacancies: Number(vacancies) || 1,
      employmentType: employmentType || 'Full Time',
      ageLimit: ageLimit || '',
      annualCtc: annualCtc || '',
      skills: skills || '',
      jobDescription: jobDescription || '',
      publishFrom: publishFrom ? new Date(publishFrom) : new Date(),
      publishTill: publishTill ? new Date(publishTill) : null,
      status: status || 'Published'
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateJobPosting = async (req, res) => {
  try {
    const job = await JobPosting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: 'Job Posting not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteJobPosting = async (req, res) => {
  try {
    const job = await JobPosting.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job Posting not found' });
    res.json({ message: 'Job Posting deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ==================== 5. APPLICATIONS RECEIVED ====================
const getApplications = async (req, res) => {
  try {
    const { jobTitle, status, fromDate, toDate, search } = req.query;
    const query = {};

    if (jobTitle && jobTitle !== 'All') query.jobTitle = jobTitle;
    if (status && status !== 'All') query.status = status;

    if (fromDate || toDate) {
      query.applicationDate = {};
      if (fromDate) query.applicationDate.$gte = new Date(fromDate);
      if (toDate) query.applicationDate.$lte = new Date(toDate);
    }

    if (search) {
      query.$or = [
        { candidateName: { $regex: search, $options: 'i' } },
        { jobTitle: { $regex: search, $options: 'i' } },
        { qualification: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const apps = await JobApplication.find(query).sort({ applicationDate: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createApplication = async (req, res) => {
  try {
    const {
      jobId, jobTitle, candidateName, email, phone, qualification,
      experienceYrs, currentCtc, expectedCtc, noticePeriod, resumeUrl, remarks
    } = req.body;

    if (!candidateName || !jobTitle) {
      return res.status(400).json({ message: 'Candidate Name and Job Title are required' });
    }

    const app = await JobApplication.create({
      jobId: jobId || null,
      jobTitle: jobTitle.trim(),
      candidateName: candidateName.trim(),
      email: email || '',
      phone: phone || '',
      qualification: qualification || '',
      experienceYrs: Number(experienceYrs) || 0,
      currentCtc: currentCtc || '',
      expectedCtc: expectedCtc || '',
      noticePeriod: noticePeriod || 'Immediate',
      resumeUrl: resumeUrl || '',
      applicationDate: new Date(),
      status: 'Applied',
      round: 'Screening',
      remarks: remarks || ''
    });
    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status, round, remarks, offeredSalary } = req.body;
    const app = await JobApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });

    if (status) app.status = status;
    if (round) app.round = round;
    if (remarks !== undefined) app.remarks = remarks;
    if (offeredSalary) app.offeredSalary = offeredSalary;

    await app.save();
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const generateOfferLetter = async (req, res) => {
  try {
    const { offeredSalary } = req.body;
    const app = await JobApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });

    app.offerLetterGenerated = true;
    app.offerLetterDate = new Date();
    app.status = 'Selected';
    if (offeredSalary) app.offeredSalary = offeredSalary;

    await app.save();
    res.json({ message: 'Offer Letter generated successfully!', application: app });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const app = await JobApplication.findByIdAndDelete(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ==================== 6. SLOT ASSIGNING ====================
const getSlotAssignments = async (req, res) => {
  try {
    const { fromDate, toDate, status, search } = req.query;
    const query = {};

    if (status && status !== 'All') query.status = status;
    if (fromDate || toDate) {
      query.interviewDate = {};
      if (fromDate) query.interviewDate.$gte = new Date(fromDate);
      if (toDate) query.interviewDate.$lte = new Date(toDate);
    }

    if (search) {
      query.$or = [
        { candidateName: { $regex: search, $options: 'i' } },
        { jobTitle: { $regex: search, $options: 'i' } },
        { interviewerName: { $regex: search, $options: 'i' } }
      ];
    }

    const assignments = await SlotAssignment.find(query).sort({ interviewDate: 1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createSlotAssignment = async (req, res) => {
  try {
    const {
      applicationId, candidateName, jobTitle, interviewTypeId,
      interviewType, interviewSlotId, interviewSlot, interviewDate,
      interviewerName, venue, remarks
    } = req.body;

    if (!candidateName || !interviewDate) {
      return res.status(400).json({ message: 'Candidate Name and Interview Date are required' });
    }

    const assignment = await SlotAssignment.create({
      applicationId: applicationId || null,
      candidateName: candidateName.trim(),
      jobTitle: jobTitle || '',
      interviewTypeId: interviewTypeId || null,
      interviewType: interviewType || 'Technical Interview',
      interviewSlotId: interviewSlotId || null,
      interviewSlot: interviewSlot || 'Morning Slot 1',
      interviewDate: new Date(interviewDate),
      interviewerName: interviewerName || 'Ayup Tech Panel',
      venue: venue || 'Conference Room / Google Meet',
      status: 'Scheduled',
      feedback: remarks || ''
    });

    // Also update application status if linked
    if (applicationId) {
      await JobApplication.findByIdAndUpdate(applicationId, {
        status: 'Interview Scheduled',
        round: interviewType || 'Technical Round'
      });
    }

    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateSlotAssignment = async (req, res) => {
  try {
    const assignment = await SlotAssignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteSlotAssignment = async (req, res) => {
  try {
    const item = await SlotAssignment.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Assignment not found' });
    res.json({ message: 'Slot assignment removed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ==================== 7. TRAVEL PLAN APPROVAL ====================
const getTravelPlans = async (req, res) => {
  try {
    const { fromDate, toDate, status, search } = req.query;
    const query = {};

    if (status && status !== 'All') query.status = status;
    if (fromDate || toDate) {
      query.fromDate = {};
      if (fromDate) query.fromDate.$gte = new Date(fromDate);
      if (toDate) query.fromDate.$lte = new Date(toDate);
    }

    if (search) {
      query.$or = [
        { candidateName: { $regex: search, $options: 'i' } },
        { destinationCity: { $regex: search, $options: 'i' } },
        { purpose: { $regex: search, $options: 'i' } }
      ];
    }

    const plans = await TravelPlan.find(query).sort({ fromDate: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTravelPlan = async (req, res) => {
  try {
    const {
      candidateName, empNo, purpose, fromDate, toDate,
      sourceCity, destinationCity, modeOfTravel, estimatedAmount, remarks
    } = req.body;

    if (!candidateName || !fromDate || !toDate) {
      return res.status(400).json({ message: 'Candidate Name, From Date, and To Date are required' });
    }

    const plan = await TravelPlan.create({
      candidateName: candidateName.trim(),
      empNo: empNo || '',
      purpose: purpose || 'On-site Interview & Demo',
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      sourceCity: sourceCity || '',
      destinationCity: destinationCity || '',
      modeOfTravel: modeOfTravel || 'Train',
      estimatedAmount: Number(estimatedAmount) || 0,
      approvedAmount: Number(estimatedAmount) || 0,
      status: 'Pending',
      remarks: remarks || ''
    });
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTravelPlanStatus = async (req, res) => {
  try {
    const { status, approvedAmount, remarks } = req.body;
    const plan = await TravelPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Travel plan not found' });

    if (status) plan.status = status;
    if (approvedAmount !== undefined) plan.approvedAmount = Number(approvedAmount);
    if (remarks !== undefined) plan.remarks = remarks;

    await plan.save();
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTravelPlan = async (req, res) => {
  try {
    const plan = await TravelPlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Travel plan not found' });
    res.json({ message: 'Travel plan deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  // 1. Interview Types
  getInterviewTypes,
  createInterviewType,
  updateInterviewType,
  deleteInterviewType,

  // 2. Assessment Types
  getAssessmentTypes,
  createAssessmentType,
  updateAssessmentType,
  deleteAssessmentType,

  // 3. Interview Slots
  getInterviewSlots,
  createInterviewSlot,
  updateInterviewSlot,
  deleteInterviewSlot,

  // 4. Job Postings
  getJobPostings,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,

  // 5. Applications Received
  getApplications,
  createApplication,
  updateApplicationStatus,
  generateOfferLetter,
  deleteApplication,

  // 6. Slot Assigning
  getSlotAssignments,
  createSlotAssignment,
  updateSlotAssignment,
  deleteSlotAssignment,

  // 7. Travel Plan Approval
  getTravelPlans,
  createTravelPlan,
  updateTravelPlanStatus,
  deleteTravelPlan
};
