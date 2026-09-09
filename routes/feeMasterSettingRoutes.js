const express = require('express');
const router = express.Router();
const {
  getSettingByKey,
  updateSettingByKey
} = require('../controllers/feeMasterSettingController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/:key')
  .get(getSettingByKey)
  .post(updateSettingByKey);

module.exports = router;
