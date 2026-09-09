const express = require('express');
const router = express.Router();
const {
  createRelateClassSection,
  getRelateClassSections,
  getRelateClassSectionById,
  updateRelateClassSection,
  deleteRelateClassSection
} = require('../controllers/relateClassSectionController');

router.route('/')
  .post(createRelateClassSection)
  .get(getRelateClassSections);

router.route('/:id')
  .get(getRelateClassSectionById)
  .put(updateRelateClassSection)
  .delete(deleteRelateClassSection);

module.exports = router;
