const express = require('express');
const router = express.Router();
const { getFeeGroups, createFeeGroup, updateFeeGroup, deleteFeeGroup } = require('../controllers/feeGroupController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getFeeGroups)
  .post(protect, createFeeGroup);

router.route('/:id')
  .put(protect, updateFeeGroup)
  .delete(protect, deleteFeeGroup);

module.exports = router;
