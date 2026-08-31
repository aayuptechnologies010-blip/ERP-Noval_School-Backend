const express = require('express');
const router = express.Router();
const {
  createSchoolDetails,
  getSchoolDetails,
  getSchoolDetailsById,
  updateSchoolDetails,
  deleteSchoolDetails
} = require('../controllers/schoolGlobalDetailsController');

router.route('/')
  .post(createSchoolDetails)
  .get(getSchoolDetails);

router.route('/:id')
  .get(getSchoolDetailsById)
  .put(updateSchoolDetails)
  .delete(deleteSchoolDetails);

module.exports = router;
