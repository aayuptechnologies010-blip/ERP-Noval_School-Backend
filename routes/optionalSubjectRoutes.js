const express = require('express');
const router = express.Router();
const {
  createOptionalSubject,
  getOptionalSubjects,
  getOptionalSubjectById,
  updateOptionalSubject,
  deleteOptionalSubject
} = require('../controllers/optionalSubjectController');

router.route('/')
  .post(createOptionalSubject)
  .get(getOptionalSubjects);

router.route('/:id')
  .get(getOptionalSubjectById)
  .put(updateOptionalSubject)
  .delete(deleteOptionalSubject);

module.exports = router;
