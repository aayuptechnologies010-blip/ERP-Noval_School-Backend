const express = require('express');
const router = express.Router();
const {
  getTCSetting,
  upsertTCSetting
} = require('../controllers/tcSettingController');

router.route('/')
  .get(getTCSetting)
  .put(upsertTCSetting);

module.exports = router;
