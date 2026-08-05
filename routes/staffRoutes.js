const express = require('express');
const router = express.Router();
const {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  toggleStaffStatus
} = require('../controllers/staffController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadSingle } = require('../middlewares/uploadMiddleware');

// All staff routes require admin authentication
router.use(protect);

router.route('/')
  .post(uploadSingle.single('staffPhoto'), createStaff)
  .get(getAllStaff);

router.route('/:id')
  .get(getStaffById)
  .put(uploadSingle.single('staffPhoto'), updateStaff)
  .delete(deleteStaff);

router.route('/:id/status')
  .patch(toggleStaffStatus);

module.exports = router;
