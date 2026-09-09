const express = require('express');
const router = express.Router();
const { getFeeHeads, createFeeHead, updateFeeHead, deleteFeeHead } = require('../controllers/feeHeadController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getFeeHeads)
  .post(protect, createFeeHead);

router.route('/:id')
  .put(protect, updateFeeHead)
  .delete(protect, deleteFeeHead);

module.exports = router;
