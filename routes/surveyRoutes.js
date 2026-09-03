const express = require('express');
const router = express.Router();
const {
  createSurvey,
  getAllSurveys,
  getSurveyById,
  updateSurvey,
  deleteSurvey
} = require('../controllers/surveyController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .post(createSurvey)
  .get(getAllSurveys);

router.route('/:id')
  .get(getSurveyById)
  .put(updateSurvey)
  .delete(deleteSurvey);

module.exports = router;
