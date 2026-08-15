const express = require('express');
const router = express.Router();
const {
  createStudentInfraction,
  getStudentInfractions,
  getStudentInfractionById,
  updateStudentInfraction,
  deleteStudentInfraction
} = require('../controllers/studentInfractionController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getStudentInfractions)
  .post(createStudentInfraction);

router.route('/:id')
  .get(getStudentInfractionById)
  .put(updateStudentInfraction)
  .delete(deleteStudentInfraction);

module.exports = router;
