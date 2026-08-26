const express = require('express');
const router = express.Router();
const {
  createAcademicYear,
  getAcademicYears,
  updateAcademicYear,
  deleteAcademicYear
} = require('../controllers/academicYearController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, createAcademicYear)
  .get(protect, getAcademicYears);

router.route('/:id')
  .put(protect, updateAcademicYear)
  .delete(protect, deleteAcademicYear);

module.exports = router;
