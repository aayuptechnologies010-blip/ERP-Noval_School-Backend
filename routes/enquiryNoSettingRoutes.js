const express = require('express');
const router = express.Router();
const { getSetting, updateSetting } = require('../controllers/enquiryNoSettingController');

router.route('/')
  .get(getSetting)
  .put(updateSetting);

module.exports = router;
