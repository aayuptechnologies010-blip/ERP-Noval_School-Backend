const express = require('express');
const router = express.Router();
const {
  createQuestionPaper,
  getQuestionPapers,
  getQuestionPaperById,
  updateQuestionPaper,
  deleteQuestionPaper
} = require('../controllers/questionPaperController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .post(createQuestionPaper)
  .get(getQuestionPapers);

router.route('/:id')
  .get(getQuestionPaperById)
  .put(updateQuestionPaper)
  .delete(deleteQuestionPaper);

module.exports = router;
