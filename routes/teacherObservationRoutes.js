const express = require('express');
const router = express.Router();
const {
  createObservation,
  getAllObservations,
  getObservationsByStaff,
  getObservationById,
  updateObservation,
  deleteObservation,
  getObservationReport
} = require('../controllers/teacherObservationController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .post(createObservation)
  .get(getAllObservations);

router.route('/report')
  .get(getObservationReport);

router.route('/staff/:staffId')
  .get(getObservationsByStaff);

router.route('/:id')
  .get(getObservationById)
  .put(updateObservation)
  .delete(deleteObservation);

module.exports = router;
