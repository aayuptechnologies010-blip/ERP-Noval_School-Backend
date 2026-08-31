const express = require('express');
const router = express.Router();
const {
  createSchoolGlobalFeeType,
  getSchoolGlobalFeeTypes,
  getSchoolGlobalFeeTypeById,
  updateSchoolGlobalFeeType,
  deleteSchoolGlobalFeeType
} = require('../controllers/schoolGlobalFeeTypeController');

router.route('/')
  .post(createSchoolGlobalFeeType)
  .get(getSchoolGlobalFeeTypes);

router.route('/:id')
  .get(getSchoolGlobalFeeTypeById)
  .put(updateSchoolGlobalFeeType)
  .delete(deleteSchoolGlobalFeeType);

module.exports = router;
