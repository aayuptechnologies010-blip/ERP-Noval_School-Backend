const express = require('express');
const router = express.Router();
const {
  createClassSection,
  getClassSections,
  getClassSectionById,
  getSectionsByClassName,
  deleteClassSection
} = require('../controllers/classSectionController');

router.route('/')
  .post(createClassSection)
  .get(getClassSections);

// Specific route for fetching sections by class name
router.route('/class/:className')
  .get(getSectionsByClassName);

router.route('/:id')
  .get(getClassSectionById)
  .delete(deleteClassSection);

module.exports = router;
