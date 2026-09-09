const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

const {
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
} = require('../controllers/recruitmentController');

// Allow public candidate submission for employment applications, protect management routes
router.post('/applications/public', createApplication);

// Protect all admin recruitment management routes
router.use(protect);

// 1. Interview Types
router.route('/interview-types')
  .get(getInterviewTypes)
  .post(createInterviewType);
router.route('/interview-types/:id')
  .put(updateInterviewType)
  .delete(deleteInterviewType);

// 2. Assessment Types
router.route('/assessment-types')
  .get(getAssessmentTypes)
  .post(createAssessmentType);
router.route('/assessment-types/:id')
  .put(updateAssessmentType)
  .delete(deleteAssessmentType);

// 3. Interview Slots
router.route('/interview-slots')
  .get(getInterviewSlots)
  .post(createInterviewSlot);
router.route('/interview-slots/:id')
  .put(updateInterviewSlot)
  .delete(deleteInterviewSlot);

// 4. Job Postings
router.route('/job-postings')
  .get(getJobPostings)
  .post(createJobPosting);
router.route('/job-postings/:id')
  .put(updateJobPosting)
  .delete(deleteJobPosting);

// 5. Applications Received
router.route('/applications')
  .get(getApplications)
  .post(createApplication);
router.route('/applications/:id')
  .put(updateApplicationStatus)
  .delete(deleteApplication);
router.route('/applications/:id/offer-letter')
  .post(generateOfferLetter);

// 6. Slot Assigning
router.route('/slot-assignments')
  .get(getSlotAssignments)
  .post(createSlotAssignment);
router.route('/slot-assignments/:id')
  .put(updateSlotAssignment)
  .delete(deleteSlotAssignment);

// 7. Travel Plan Approval
router.route('/travel-plans')
  .get(getTravelPlans)
  .post(createTravelPlan);
router.route('/travel-plans/:id')
  .put(updateTravelPlanStatus)
  .delete(deleteTravelPlan);

module.exports = router;
