const express = require('express');
const router = express.Router();
const {
  createStudentAppreciation,
  getStudentAppreciations,
  getStudentAppreciationById,
  updateStudentAppreciation,
  deleteStudentAppreciation
} = require('../controllers/studentAppreciationController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getStudentAppreciations)
  .post(createStudentAppreciation);

router.route('/:id')
  .get(getStudentAppreciationById)
  .put(updateStudentAppreciation)
  .delete(deleteStudentAppreciation);

module.exports = router;
