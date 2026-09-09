const express = require('express');
const router = express.Router();
const { getExpenseHeads, createExpenseHead, updateExpenseHead, deleteExpenseHead } = require('../controllers/expenseHeadController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getExpenseHeads)
  .post(protect, createExpenseHead);

router.route('/:id')
  .put(protect, updateExpenseHead)
  .delete(protect, deleteExpenseHead);

module.exports = router;
