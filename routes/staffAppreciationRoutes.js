const express = require('express');
const router = express.Router();
const {
  createStaffAppreciation,
  getStaffAppreciations,
  getStaffAppreciationById,
  updateStaffAppreciation,
  deleteStaffAppreciation
} = require('../controllers/staffAppreciationController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getStaffAppreciations)
  .post(createStaffAppreciation);

router.route('/:id')
  .get(getStaffAppreciationById)
  .put(updateStaffAppreciation)
  .delete(deleteStaffAppreciation);

module.exports = router;
