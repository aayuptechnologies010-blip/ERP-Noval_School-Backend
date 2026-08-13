const express = require('express');
const router = express.Router();
const {
  sendSms,
  getAllSms,
  getSmsById,
  deleteSms,
  createTemplate,
  getTemplates,
  updateTemplate,
  deleteTemplate
} = require('../controllers/smsController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

// SMS Templates Routes
router.route('/templates')
  .post(createTemplate)
  .get(getTemplates);

router.route('/templates/:id')
  .put(updateTemplate)
  .delete(deleteTemplate);

// SMS Logs / Send Routes
router.route('/')
  .post(sendSms)
  .get(getAllSms);

router.route('/:id')
  .get(getSmsById)
  .delete(deleteSms);

module.exports = router;
