const express = require('express');
const router = express.Router();
const {
  markStaffAttendance,
  getStaffAttendanceByDeptDate,
  updateSingleStaffAttendance,
} = require('../controllers/staffAttendanceController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/mark', markStaffAttendance);
router.get('/', getStaffAttendanceByDeptDate);
router.put('/:id', updateSingleStaffAttendance);

module.exports = router;
