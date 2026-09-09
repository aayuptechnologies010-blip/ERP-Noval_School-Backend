const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getMonthlyDeductions,
  generateMonthlyDeductions,
  deleteMonthlyDeductions,
  updateSingleDeduction,
  deleteSingleDeduction
} = require('../controllers/monthlyInsuranceDeductionController');

router.use(protect);

router.route('/')
  .get(getMonthlyDeductions)
  .delete(deleteMonthlyDeductions);

router.post('/generate', generateMonthlyDeductions);

router.route('/:id')
  .put(updateSingleDeduction)
  .delete(deleteSingleDeduction);

module.exports = router;

