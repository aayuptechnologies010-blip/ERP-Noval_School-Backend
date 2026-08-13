const express = require('express');
const router = express.Router();
const {
  getContacts,
  sendSpecifiedMessage,
  createTemplate,
  getTemplates,
  deleteTemplate
} = require('../controllers/specifiedMessageController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadDocument } = require('../middlewares/uploadMiddleware');

router.use(protect);

// Contacts API
router.route('/contacts')
  .get(getContacts);

// Send Bulk Message API
router.route('/send')
  .post(uploadDocument.single('attachment'), sendSpecifiedMessage);

// Template APIs
router.route('/templates')
  .get(getTemplates)
  .post(createTemplate);

router.route('/templates/:id')
  .delete(deleteTemplate);

module.exports = router;
