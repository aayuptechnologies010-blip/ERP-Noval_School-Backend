const express = require('express');
const router = express.Router();

const {
  createLeaveRequest,
  getAllLeaveRequests,
  getLeaveRequestById,
  updateLeaveStatus,
  deleteLeaveRequest,
  getStudentLeaveRequests,
  getLeaveStats,
} = require('../controllers/leaveRequestController');

const { protect } = require('../middlewares/authMiddleware');

// All routes require admin authentication
router.use(protect);

// ─── Specific routes (must be before /:id) ─────────────────────────────────

// GET /api/leave-requests/stats         → Summary counts + recent pending
router.get('/stats', getLeaveStats);

// GET /api/leave-requests/student/:sid  → Student's leave history
router.get('/student/:studentId', getStudentLeaveRequests);

// ─── Main CRUD routes ──────────────────────────────────────────────────────

// POST /api/leave-requests              → Create leave request
// GET  /api/leave-requests              → List all (with filters)
router.route('/')
  .post(createLeaveRequest)
  .get(getAllLeaveRequests);

// GET    /api/leave-requests/:id        → Get single record
// DELETE /api/leave-requests/:id        → Delete record
router.route('/:id')
  .get(getLeaveRequestById)
  .delete(deleteLeaveRequest);

// PATCH /api/leave-requests/:id/status  → Approve / Reject
router.patch('/:id/status', updateLeaveStatus);

module.exports = router;
