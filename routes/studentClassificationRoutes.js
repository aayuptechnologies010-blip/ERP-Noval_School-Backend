const express = require('express');
const router = express.Router();
const {
  createClassification,
  getClassifications,
  getClassificationById,
  updateClassification,
  deleteClassification
} = require('../controllers/studentClassificationController');

router.route('/')
  .post(createClassification)
  .get(getClassifications);

router.route('/:id')
  .get(getClassificationById)
  .put(updateClassification)
  .delete(deleteClassification);

module.exports = router;
