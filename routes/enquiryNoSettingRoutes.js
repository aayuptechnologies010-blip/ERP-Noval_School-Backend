const express = require('express');
const router = express.Router();
const {
  getEnquiryNoSetting,
  updateEnquiryNoSetting
} = require('../controllers/enquiryNoSettingController');

router.route('/:sessionId')
  .get(getEnquiryNoSetting)
  .put(updateEnquiryNoSetting);

module.exports = router;
