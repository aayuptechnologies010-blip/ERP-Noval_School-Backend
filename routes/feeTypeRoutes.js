const express = require('express');
const router = express.Router();
const { getFeeTypes, createFeeType, updateFeeType, deleteFeeType } = require('../controllers/feeTypeController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getFeeTypes)
  .post(protect, createFeeType);

router.route('/:id')
  .put(protect, updateFeeType)
  .delete(protect, deleteFeeType);

module.exports = router;
