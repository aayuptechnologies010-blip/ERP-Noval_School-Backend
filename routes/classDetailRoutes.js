const express = require('express');
const router = express.Router();
const {
  createClassDetail,
  getClassDetails,
  getClassDetailById,
  updateClassDetail,
  deleteClassDetail
} = require('../controllers/classDetailController');

router.route('/')
  .post(createClassDetail)
  .get(getClassDetails);

router.route('/:id')
  .get(getClassDetailById)
  .put(updateClassDetail)
  .delete(deleteClassDetail);

module.exports = router;
