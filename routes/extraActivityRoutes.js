const express = require('express');
const router = express.Router();
const {
  createExtraActivity,
  getExtraActivities,
  getExtraActivityById,
  updateExtraActivity,
  deleteExtraActivity
} = require('../controllers/extraActivityController');

router.route('/')
  .post(createExtraActivity)
  .get(getExtraActivities);

router.route('/:id')
  .get(getExtraActivityById)
  .put(updateExtraActivity)
  .delete(deleteExtraActivity);

module.exports = router;
