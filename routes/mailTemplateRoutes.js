const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getAllMailTemplates,
  createMailTemplate,
  updateMailTemplate,
  deleteMailTemplate
} = require('../controllers/mailTemplateController');

router.use(protect);

router.route('/')
  .get(getAllMailTemplates)
  .post(createMailTemplate);

router.route('/:id')
  .put(updateMailTemplate)
  .delete(deleteMailTemplate);

module.exports = router;
