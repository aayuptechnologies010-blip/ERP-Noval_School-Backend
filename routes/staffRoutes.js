const express = require('express');
const router = express.Router();
const {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  toggleStaffStatus,
  getFavoriteStaff,
  toggleStaffFavorite,
  bulkAssignClassTeacher
} = require('../controllers/staffController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadSingle } = require('../middlewares/uploadMiddleware');

// All staff routes require admin authentication
router.use(protect);

router.route('/')
  .post(uploadSingle.single('staffPhoto'), createStaff)
  .get(getAllStaff);

// Bulk assign class teacher (must be before /:id)
router.put('/bulk/assign-class-teacher', bulkAssignClassTeacher);

// Get favorite staff (must be before /:id)
router.get('/favorites', getFavoriteStaff);

router.route('/:id')
  .get(getStaffById)
  .put(uploadSingle.single('staffPhoto'), updateStaff)
  .delete(deleteStaff);

router.route('/:id/status')
  .patch(toggleStaffStatus);

router.route('/:id/favorite')
  .patch(toggleStaffFavorite);

module.exports = router;
