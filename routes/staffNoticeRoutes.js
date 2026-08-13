const express = require('express');
const router = express.Router();
const {
  createStaffNotice,
  getStaffNotices,
  getStaffNoticeById,
  updateStaffNotice,
  deleteStaffNotice
} = require('../controllers/staffNoticeController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getStaffNotices)
  .post(createStaffNotice);

router.route('/:id')
  .get(getStaffNoticeById)
  .put(updateStaffNotice)
  .delete(deleteStaffNotice);

module.exports = router;
