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
  getLessonPlanReport,
  getMissingAttendanceReport,
  getStatisticalReport,
  getAppUsersReport,
  getQuestionPaperReport,
  getSurveyReport,
  getSMSReport,
  getSMSConsumption,
  getSMSRechargeLog,
  getSMSUses,
  getAppMessageUses,
  getUndertakingReport
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
router.get('/missing-attendance', getMissingAttendanceReport);

// Teachers Workload
router.get('/teachers-workload', getTeachersWorkload);

// Conversation Report
router.get('/conversations', getConversationReport);

// Lesson Plan Report
router.get('/lesson-plans', getLessonPlanReport);

// Statistical Report
router.get('/statistical', getStatisticalReport);

// App Users Report
router.get('/app-users', getAppUsersReport);

// Question Paper Report
router.get('/question-papers', getQuestionPaperReport);

// Survey Report
router.get('/surveys', getSurveyReport);

// SMS Reports
router.get('/sms/report', getSMSReport);
router.get('/sms/consumption', getSMSConsumption);
router.get('/sms/recharge', getSMSRechargeLog);
router.get('/sms/uses', getSMSUses);
router.get('/app-message/uses', getAppMessageUses);
router.get('/undertaking', getUndertakingReport);

module.exports = router;
