const mongoose = require('mongoose');

const expenseHeadSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('ExpenseHead', expenseHeadSchema);
