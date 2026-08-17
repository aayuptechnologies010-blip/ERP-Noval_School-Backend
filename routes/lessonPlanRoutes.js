const express = require('express');
const router = express.Router();
const {
  createLessonPlan,
  getAllLessonPlans,
  getLessonPlanById,
  updateLessonPlan,
  deleteLessonPlan
} = require('../controllers/lessonPlanController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .post(createLessonPlan)
  .get(getAllLessonPlans);

router.route('/:id')
  .get(getLessonPlanById)
  .put(updateLessonPlan)
  .delete(deleteLessonPlan);

module.exports = router;
