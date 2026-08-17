const express = require('express');
const router = express.Router();
const {
  getBirthdays,
  getBirthdayChart,
  getTodaysBirthdays,
  getAppreciationReport,
  getInfractionReport,
  getMyInfractions,
  getAttendanceReport,
  getAverageAttendanceAnalysis,
  getTeachersWorkload,
  getConversationReport,
  getLessonPlanReport
} = require('../controllers/reportController');
const { protect } = require('../middlewares/authMiddleware');

// Protect all report routes
router.use(protect);

// Birthdays Reports
router.get('/birthdays/chart', getBirthdayChart);
router.get('/birthdays/today', getTodaysBirthdays);
router.get('/birthdays', getBirthdays);
router.get('/appreciations', getAppreciationReport);
router.get('/infractions', getInfractionReport);
router.get('/my-infractions', getMyInfractions);

// Attendance Report
router.get('/attendance', getAttendanceReport);
router.get('/average-attendance', getAverageAttendanceAnalysis);

// Teachers Workload
router.get('/teachers-workload', getTeachersWorkload);

// Conversation Report
router.get('/conversations', getConversationReport);

// Lesson Plan Report
router.get('/lesson-plans', getLessonPlanReport);

module.exports = router;
