const express = require('express');
const router = express.Router();
const { getCountrySetting, updateCountrySetting } = require('../controllers/countrySettingController');
router.route('/').get(getCountrySetting).post(updateCountrySetting);
module.exports = router;
