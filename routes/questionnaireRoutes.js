const express = require('express');
const router = express.Router();
const {
  createQuestionnaire,
  getAllQuestionnaires,
  updateQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaireById
} = require('../controllers/questionnaireController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .post(createQuestionnaire)
  .get(getAllQuestionnaires);

router.route('/:id')
  .get(getQuestionnaireById)
  .put(updateQuestionnaire)
  .delete(deleteQuestionnaire);

module.exports = router;
