const express = require('express');
const router = express.Router();
const {
  createSection,
  getSections,
  getSectionById,
  updateSection,
  deleteSection
} = require('../controllers/sectionController');

router.route('/')
  .post(createSection)
  .get(getSections);

router.route('/:id')
  .get(getSectionById)
  .put(updateSection)
  .delete(deleteSection);

module.exports = router;
