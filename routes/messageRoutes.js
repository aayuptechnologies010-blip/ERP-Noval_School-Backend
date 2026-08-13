const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getSentMessages,
  getInboxMessages,
  getMessageById,
  deleteMessage
} = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadDocument } = require('../middlewares/uploadMiddleware');

router.use(protect);

router.route('/')
  .post(uploadDocument.single('attachment'), sendMessage);

router.route('/sent')
  .get(getSentMessages);

router.route('/inbox')
  .get(getInboxMessages);

router.route('/:id')
  .get(getMessageById)
  .delete(deleteMessage);

module.exports = router;
