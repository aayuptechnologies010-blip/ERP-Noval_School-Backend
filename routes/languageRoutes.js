const express = require('express');
const router = express.Router();
const {
  createLanguage,
  getLanguages,
  getLanguageById,
  updateLanguage,
  deleteLanguage
} = require('../controllers/languageController');

router.route('/')
  .post(createLanguage)
  .get(getLanguages);

router.route('/:id')
  .get(getLanguageById)
  .put(updateLanguage)
  .delete(deleteLanguage);

module.exports = router;
