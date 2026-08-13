const express = require('express');
const router = express.Router();

const {
  getEligibleStudents,
  promoteStudents,
  getPromotionHistory,
  getStudentPromotionHistory,
  getDistinctClasses,
  deletePromotionRecord,
} = require('../controllers/promotionController');

const { protect } = require('../middlewares/authMiddleware');

// All promotion routes require admin authentication
router.use(protect);

// ─── Specific routes (must be before /:id) ─────────────────────────────────

// GET  /api/promotions/eligible          → Fetch eligible students for promotion
router.get('/eligible', getEligibleStudents);

// GET  /api/promotions/classes           → Distinct classes & sections (for dropdown)
router.get('/classes', getDistinctClasses);

// GET  /api/promotions/history           → Full promotion history log (with filters)
router.get('/history', getPromotionHistory);

// GET  /api/promotions/history/student/:sid → Student's personal promotion history
router.get('/history/student/:studentId', getStudentPromotionHistory);

// ─── Main action routes ────────────────────────────────────────────────────

// POST /api/promotions/promote           → Bulk promote selected students
router.post('/promote', promoteStudents);

// ─── Record-level routes ───────────────────────────────────────────────────

// DELETE /api/promotions/history/:id     → Delete a history record (audit correction)
router.delete('/history/:id', deletePromotionRecord);

module.exports = router;
