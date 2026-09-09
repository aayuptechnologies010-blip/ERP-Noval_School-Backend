const express = require('express');
const router = express.Router();
const {
  upsertTimetable,
  getTimetable,
  deleteTimetable,
  getDashboardStats,
  getPredefinedTimetable,
  autoGenerateTimetable,
  deleteTimetablesByClass,
  replaceTeacher,
  getTeacherTimetable,
  assignTeacherTimetable,
  transferTimetable,
  getAcademicSessions
} = require('../controllers/timetableController');

const {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getResources,
  createResource,
  updateResource,
  deleteResource,
  getGlobalSetting,
  updateGlobalSetting,
  getTeacherSettings,
  upsertTeacherSetting,
  getClassSettings,
  upsertClassSetting,
  getPeriodSettings,
  upsertPeriodSetting,
  getClassSubjects,
  upsertClassSubjects,
  getPeriodAllotments,
  upsertPeriodAllotment,
  getResourceSubjects,
  upsertResourceSubject,
  getClassTeachers,
  upsertClassTeacher,
  getClassTeacherSubjects,
  upsertClassTeacherSubject,
  getSubstitutionSettings,
  upsertSubstitutionSettings
} = require('../controllers/timetableMasterController');

const {
  getParallelAllocations,
  upsertParallelAllocation,
  getFixedAllocations,
  upsertFixedAllocation,
  getConsecutiveAllocations,
  upsertConsecutiveAllocation,
  getPreferenceAllocations,
  upsertPreferenceAllocation
} = require('../controllers/timetableConstraintController');

const { protect } = require('../middlewares/authMiddleware');

const {
  getMarkAttendance,
  saveMarkAttendance,
  getSubstitutions,
  createSubstitution,
  updateSubstitution,
  deleteSubstitution
} = require('../controllers/timetableSubstitutionController');

const {
  getReportFilters,
  getClassList,
  getSubjectList,
  getTeacherClassSubject,
  getSubjectTaught,
  getClassTeachers: getReportClassTeachers,
  getWingWiseTeachers,
  getSubjectWiseTeachers,
  getDateWiseSubstitution,
  getTeacherWorkload,
  getFreeTeachers,
  getClassTimetableReport,
  getTeacherTimetableReport,
  getTimetableLogs,
  getParallelAllocationsReport,
  getConsecutiveAllocationsReport,
  getResourceTimetableReport,
  getClassResourceReport,
  getUnallocatedPeriodsReport,
  getClassWiseTeacherAllocation,
  getAssignmentStatus,
  getSubjectSummary,
  getSubjectWiseTeacherAllocation,
  getTimetableAtGlance
} = require('../controllers/timetableReportsController');

router.use(protect);

router.get('/dashboard-stats', getDashboardStats);

router.route('/')
  .post(upsertTimetable)
  .get(getTimetable)
  .delete(deleteTimetable);

// Master Routes
router.route('/subjects')
  .get(getSubjects)
  .post(createSubject);

router.route('/subjects/:id')
  .put(updateSubject)
  .delete(deleteSubject);

router.route('/resources')
  .get(getResources)
  .post(createResource);

router.route('/resources/:id')
  .put(updateResource)
  .delete(deleteResource);

// Phase 2 Routes
router.route('/global-settings')
  .get(getGlobalSetting)
  .put(updateGlobalSetting);

router.route('/teacher-settings')
  .get(getTeacherSettings)
  .post(upsertTeacherSetting);

router.route('/class-settings')
  .get(getClassSettings)
  .post(upsertClassSetting);

router.route('/period-settings')
  .get(getPeriodSettings)
  .post(upsertPeriodSetting);

// Phase 3 Routes
router.route('/class-subjects')
  .get(getClassSubjects)
  .post(upsertClassSubjects);

router.route('/period-allotment')
  .get(getPeriodAllotments)
  .post(upsertPeriodAllotment);

router.route('/resource-subject')
  .get(getResourceSubjects)
  .post(upsertResourceSubject);

router.route('/class-teachers')
  .get(getClassTeachers)
  .post(upsertClassTeacher);

router.route('/class-teacher-subjects')
  .get(getClassTeacherSubjects)
  .post(upsertClassTeacherSubject);

router.route('/substitution-settings')
  .get(getSubstitutionSettings)
  .post(upsertSubstitutionSettings);

// Constraint Routes
router.route('/constraints/parallel')
  .get(getParallelAllocations)
  .post(upsertParallelAllocation);

router.route('/constraints/fixed')
  .get(getFixedAllocations)
  .post(upsertFixedAllocation);

router.route('/constraints/consecutive')
  .get(getConsecutiveAllocations)
  .post(upsertConsecutiveAllocation);

router.route('/constraints/preference')
  .get(getPreferenceAllocations)
  .post(upsertPreferenceAllocation);

// Create Timetable Routes
router.get('/predefined', getPredefinedTimetable);
router.post('/auto-generate', autoGenerateTimetable);
router.delete('/by-classes', deleteTimetablesByClass);
router.post('/replace-teacher', replaceTeacher);
router.get('/teacher-timetable', getTeacherTimetable);
router.post('/assign-teacher', assignTeacherTimetable);
router.post('/transfer', transferTimetable);
router.get('/academic-sessions', getAcademicSessions);

// Substitution Master Routes
router.route('/mark-attendance')
  .get(getMarkAttendance)
  .post(saveMarkAttendance);

router.route('/substitution')
  .get(getSubstitutions)
  .post(createSubstitution);

router.route('/substitution/:id')
  .put(updateSubstitution)
  .delete(deleteSubstitution);

// Timetable Reports Routes
router.get('/reports/filters', getReportFilters);
router.get('/reports/classes', getClassList);
router.get('/reports/subjects', getSubjectList);
router.get('/reports/teacher-class-subject', getTeacherClassSubject);
router.get('/reports/subject-taught', getSubjectTaught);
router.get('/reports/class-teachers', getReportClassTeachers);
router.get('/reports/wing-wise-teachers', getWingWiseTeachers);
router.get('/reports/subject-wise-teachers', getSubjectWiseTeachers);
router.get('/reports/date-wise-substitution', getDateWiseSubstitution);
router.get('/reports/teacher-workload', getTeacherWorkload);
router.get('/reports/free-teachers', getFreeTeachers);
router.get('/reports/class-timetable', getClassTimetableReport);
router.get('/reports/teacher-timetable', getTeacherTimetableReport);
router.get('/reports/timetable-logs', getTimetableLogs);
router.get('/reports/parallel-allocations', getParallelAllocationsReport);
router.get('/reports/consecutive-allocations', getConsecutiveAllocationsReport);
router.get('/reports/resource-timetable', getResourceTimetableReport);
router.get('/reports/class-resource', getClassResourceReport);
router.get('/reports/unallocated-periods', getUnallocatedPeriodsReport);
router.get('/reports/class-wise-teacher-allocation', getClassWiseTeacherAllocation);
router.get('/reports/assignment-status', getAssignmentStatus);
router.get('/reports/subject-summary', getSubjectSummary);
router.get('/reports/subject-wise-teacher-allocation', getSubjectWiseTeacherAllocation);
router.get('/reports/timetable-at-glance', getTimetableAtGlance);

module.exports = router;
