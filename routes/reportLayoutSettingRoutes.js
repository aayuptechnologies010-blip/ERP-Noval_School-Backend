const express = require('express');
const router = express.Router();
const {
  createReportLayoutSetting,
  getReportLayoutSettings,
  getReportLayoutSettingById,
  updateReportLayoutSetting,
  deleteReportLayoutSetting
} = require('../controllers/reportLayoutSettingController');

router.route('/')
  .post(createReportLayoutSetting)
  .get(getReportLayoutSettings);

router.route('/:id')
  .get(getReportLayoutSettingById)
  .put(updateReportLayoutSetting)
  .delete(deleteReportLayoutSetting);

module.exports = router;
