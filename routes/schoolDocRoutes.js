const express = require('express');
const router = express.Router();
const {
  getAllSchoolDocs,
  createSchoolDoc,
  deleteSchoolDoc
} = require('../controllers/schoolDocController');

router.route('/')
  .get(getAllSchoolDocs)
  .post(createSchoolDoc);

router.route('/:id')
  .delete(deleteSchoolDoc);

module.exports = router;
