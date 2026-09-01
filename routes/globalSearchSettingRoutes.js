const express = require('express');
const router = express.Router();
const {
  getGlobalSearchSettings,
  updateGlobalSearchSettings
} = require('../controllers/globalSearchSettingController');

router.route('/')
  .get(getGlobalSearchSettings)
  .put(updateGlobalSearchSettings);

module.exports = router;
