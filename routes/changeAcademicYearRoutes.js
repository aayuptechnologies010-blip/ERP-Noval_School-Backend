const express = require('express');
const router = express.Router();
const {
  getChangeAcademicYearOptions,
  changeAcademicYear
} = require('../controllers/changeAcademicYearController');

router.route('/options').get(getChangeAcademicYearOptions);
router.route('/').get(getChangeAcademicYearOptions).post(changeAcademicYear);


module.exports = router;
