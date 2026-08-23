const express = require('express');
const router = express.Router();
const {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam
} = require('../controllers/examController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .post(createExam)
  .get(getAllExams);

router.route('/:id')
  .get(getExamById)
  .put(updateExam)
  .delete(deleteExam);

module.exports = router;
