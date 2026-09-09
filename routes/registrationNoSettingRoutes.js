const express = require('express');
const router = express.Router();
const {
  getDropdownOptions,
  getRegistrationNoSetting,
  upsertRegistrationNoSetting
} = require('../controllers/registrationNoSettingController');

router.route('/options').get(getDropdownOptions);
router.route('/')
  .get(getRegistrationNoSetting)
  .post(upsertRegistrationNoSetting);

module.exports = router;
