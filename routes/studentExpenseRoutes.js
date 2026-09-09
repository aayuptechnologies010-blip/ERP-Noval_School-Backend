const express = require('express');
const router = express.Router();
const { logExpense, getStudentExpenses } = require('../controllers/studentExpenseController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, logExpense);
router.get('/:studentId', protect, getStudentExpenses);

module.exports = router;
