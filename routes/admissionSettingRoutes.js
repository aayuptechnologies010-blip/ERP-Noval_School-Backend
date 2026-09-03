const express = require('express');
const router = express.Router();
const {
  getAdmissionSettings,
  updateAdmissionSettings
} = require('../controllers/admissionSettingController');

router.route('/')
  .get(getAdmissionSettings)
  .put(updateAdmissionSettings);

module.exports = router;
