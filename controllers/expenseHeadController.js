const ExpenseHead = require('../models/expenseHeadModel');

const getExpenseHeads = async (req, res) => {
  try {
    const heads = await ExpenseHead.find().sort({ createdAt: -1 });
    res.json(heads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createExpenseHead = async (req, res) => {
  try {
    const exists = await ExpenseHead.findOne({ name: req.body.name });
    if (exists) return res.status(400).json({ message: 'Expense Head already exists' });

    const head = await ExpenseHead.create(req.body);
    res.status(201).json(head);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateExpenseHead = async (req, res) => {
  try {
    const head = await ExpenseHead.findById(req.params.id);
    if (head) {
      head.name = req.body.name || head.name;
      const updated = await head.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteExpenseHead = async (req, res) => {
  try {
    const head = await ExpenseHead.findById(req.params.id);
    if (head) {
      await head.deleteOne();
      res.json({ message: 'Removed' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getExpenseHeads, createExpenseHead, updateExpenseHead, deleteExpenseHead };
