const express = require('express');
const router = express.Router();
const {
  getBirthdays,
  getBirthdayChart,
  getTodaysBirthdays,
  getAppreciationReport,
  getInfractionReport,
  getMyInfractions
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

module.exports = router;
