const express = require('express');
const router = express.Router();
const {
  createNotice,
  getNotices,
  getNoticeById,
  updateNotice,
  deleteNotice
} = require('../controllers/noticeController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getNotices)
  .post(createNotice);

router.route('/:id')
  .get(getNoticeById)
  .put(updateNotice)
  .delete(deleteNotice);

module.exports = router;
