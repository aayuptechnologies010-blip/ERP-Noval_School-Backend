const express = require('express');
const router = express.Router();
const { getAmounts, saveAmounts } = require('../controllers/feeAmountGroupController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getAmounts)
  .post(protect, saveAmounts);

module.exports = router;
