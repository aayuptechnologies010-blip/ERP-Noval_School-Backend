const express = require('express');
const router = express.Router();
const {
  createHoliday,
  getHolidays,
  updateHoliday,
  deleteHoliday
} = require('../controllers/holidayController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .post(createHoliday)
  .get(getHolidays);

router.route('/:id')
  .put(updateHoliday)
  .delete(deleteHoliday);

module.exports = router;
