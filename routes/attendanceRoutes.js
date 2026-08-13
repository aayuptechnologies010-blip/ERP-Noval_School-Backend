const express = require('express');
const router = express.Router();

const {
  markAttendance,
  getAttendanceByClassDate,
  updateSingleAttendance,
  getStudentAttendance,
  getAttendanceSummary,
  getMonthlyReport,
  getTodayAttendanceSummary,
  getAttendanceDates,
  deleteAttendanceRecord,
} = require('../controllers/attendanceController');

const { protect } = require('../middlewares/authMiddleware');

// All routes require admin authentication
router.use(protect);

// ─── Specific routes (must be before /:id) ─────────────────────────────────

// GET /api/attendance/today      → Today's summary across all classes
router.get('/today', getTodayAttendanceSummary);

// GET /api/attendance/summary    → Summary counts for class+date
router.get('/summary', getAttendanceSummary);

// GET /api/attendance/dates      → Dates when attendance was marked
router.get('/dates', getAttendanceDates);

// GET /api/attendance/report/monthly → Monthly attendance matrix
router.get('/report/monthly', getMonthlyReport);

// GET /api/attendance/student/:studentId → Student-wise attendance history
router.get('/student/:studentId', getStudentAttendance);

// ─── Main routes ───────────────────────────────────────────────────────────

// POST /api/attendance/mark      → Bulk mark attendance
router.post('/mark', markAttendance);

// GET /api/attendance            → Get records by class + section + date
router.get('/', getAttendanceByClassDate);

// ─── Record-level routes ───────────────────────────────────────────────────

// PUT /api/attendance/:id        → Update single record
router.put('/:id', updateSingleAttendance);

// DELETE /api/attendance/:id     → Delete single record
router.delete('/:id', deleteAttendanceRecord);

module.exports = router;
