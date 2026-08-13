const express = require('express');
const router = express.Router();
const {
  createClassNotice,
  getClassNotices,
  getClassNoticeById,
  updateClassNotice,
  deleteClassNotice
} = require('../controllers/classNoticeController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getClassNotices)
  .post(createClassNotice);

router.route('/:id')
  .get(getClassNoticeById)
  .put(updateClassNotice)
  .delete(deleteClassNotice);

module.exports = router;
