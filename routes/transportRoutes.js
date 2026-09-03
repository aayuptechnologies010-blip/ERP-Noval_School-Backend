const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  markAttendance,
  getAttendance,
  getTransportStudents,
  createOutPass,
  getOutPasses
} = require('../controllers/transportController');

router.use(protect);

router.post('/attendance/mark', markAttendance);
router.get('/attendance/view', getAttendance);
router.get('/students', getTransportStudents);
router.post('/outpass', createOutPass);
router.get('/outpass', getOutPasses);

module.exports = router;
