const express = require('express');
const router = express.Router();
const {
  upsertTimetable,
  getTimetable,
  deleteTimetable
} = require('../controllers/timetableController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .post(upsertTimetable)
  .get(getTimetable)
  .delete(deleteTimetable);

module.exports = router;
