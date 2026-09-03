const express = require('express');
const router = express.Router();
const { getFeeInstallments, createFeeInstallment, updateFeeInstallment, deleteFeeInstallment } = require('../controllers/feeInstallmentController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getFeeInstallments)
  .post(protect, createFeeInstallment);

router.route('/:id')
  .put(protect, updateFeeInstallment)
  .delete(protect, deleteFeeInstallment);

module.exports = router;
