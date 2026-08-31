const express = require('express');
const router = express.Router();
const {
  createSchoolClass,
  getSchoolClasses,
  updateSchoolClass,
  deleteSchoolClass
} = require('../controllers/schoolClassController');

router.route('/')
  .post(createSchoolClass)
  .get(getSchoolClasses);

router.route('/:id')
  .put(updateSchoolClass)
  .delete(deleteSchoolClass);

module.exports = router;
