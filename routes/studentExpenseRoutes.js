const express = require('express');
const router = express.Router();
const { getAllStudentExpenses, logExpense, getStudentExpenses } = require('../controllers/studentExpenseController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getAllStudentExpenses);
router.post('/', protect, logExpense);
router.get('/:studentId', protect, getStudentExpenses);

module.exports = router;
