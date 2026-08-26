const express = require('express');
const router = express.Router();
const {
  createFinancialYear,
  getFinancialYears,
  updateFinancialYear,
  deleteFinancialYear
} = require('../controllers/financialYearController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, createFinancialYear)
  .get(protect, getFinancialYears);

router.route('/:id')
  .put(protect, updateFinancialYear)
  .delete(protect, deleteFinancialYear);

module.exports = router;
