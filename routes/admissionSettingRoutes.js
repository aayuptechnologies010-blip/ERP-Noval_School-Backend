const express = require('express');
const router = express.Router();
const { getSetting, updateSetting } = require('../controllers/admissionSettingController');

router.route('/')
  .get(getSetting)
  .put(updateSetting);

module.exports = router;
