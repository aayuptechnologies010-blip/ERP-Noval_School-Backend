const express = require('express');
const router = express.Router();
const {
  getFeeReceiptSettings,
  updateFeeReceiptSettings
} = require('../controllers/feeReceiptSettingController');
const { protect } = require('../middlewares/authMiddleware');

// Protect all routes
router.use(protect);

router.route('/')
  .get(getFeeReceiptSettings)
  .post(updateFeeReceiptSettings);

module.exports = router;
