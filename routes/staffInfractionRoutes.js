const express = require('express');
const router = express.Router();
const {
  createStaffInfraction,
  getStaffInfractions,
  getStaffInfractionById,
  updateStaffInfraction,
  deleteStaffInfraction
} = require('../controllers/staffInfractionController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getStaffInfractions)
  .post(createStaffInfraction);

router.route('/:id')
  .get(getStaffInfractionById)
  .put(updateStaffInfraction)
  .delete(deleteStaffInfraction);

module.exports = router;
