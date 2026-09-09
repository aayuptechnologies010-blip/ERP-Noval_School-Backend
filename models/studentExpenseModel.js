const mongoose = require('mongoose');

const studentExpenseSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  expenseHead: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  remarks: {
    type: String
  }
}, {
  timestamps: true
});

const StudentExpense = mongoose.model('StudentExpense', studentExpenseSchema);

module.exports = StudentExpense;
