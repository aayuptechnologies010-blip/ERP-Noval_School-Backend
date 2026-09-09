const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/globalPayrollSettingController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getSettings)
  .put(updateSettings);

module.exports = router;
