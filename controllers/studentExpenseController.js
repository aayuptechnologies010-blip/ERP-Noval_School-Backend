const StudentExpense = require('../models/studentExpenseModel');
const Student = require('../models/studentModel');

// @desc    Log a student expense
// @route   POST /api/student-expenses
// @access  Private
const logExpense = async (req, res) => {
  try {
    const { studentId, expenseHead, amount, date, remarks } = req.body;

    if (!studentId || !expenseHead || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const expense = await StudentExpense.create({
      student: studentId,
      expenseHead,
      amount: Number(amount),
      date: date ? new Date(date) : Date.now(),
      remarks
    });

    res.status(201).json({ message: 'Expense logged successfully', data: expense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get expenses for a student
// @route   GET /api/student-expenses/:studentId
// @access  Private
const getStudentExpenses = async (req, res) => {
  try {
    const expenses = await StudentExpense.find({ student: req.params.studentId }).sort('-date');
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  logExpense,
  getStudentExpenses
};
