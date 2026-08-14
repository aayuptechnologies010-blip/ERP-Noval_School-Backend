const express = require('express');
const router = express.Router();
const {
  createActivity,
  getAllActivities,
} = require('../controllers/activityController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .post(createActivity)
  .get(getAllActivities);

module.exports = router;
