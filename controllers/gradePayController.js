const GradePay = require('../models/gradePayModel');

// @desc    Get all grade pays
// @route   GET /api/grade-pays
// @access  Private (Admin)
const getAll = async (req, res) => {
  try {
    const gradePays = await GradePay.find().sort({ amount: 1 });
    res.json(gradePays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single grade pay
// @route   GET /api/grade-pays/:id
// @access  Private (Admin)
const getById = async (req, res) => {
  try {
    const item = await GradePay.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Grade pay not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create grade pay
// @route   POST /api/grade-pays
// @access  Private (Admin)
const create = async (req, res) => {
  try {
    const { amount, isActive } = req.body;
    if (amount === undefined || amount === null) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    const exists = await GradePay.findOne({ amount: Number(amount) });
    if (exists) {
      return res.status(400).json({ message: 'Grade Pay amount already exists' });
    }

    const newGrade = new GradePay({
      amount: Number(amount),
      modifyDate: new Date(),
      isActive: isActive !== undefined ? !!isActive : true
    });

    const saved = await newGrade.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update grade pay
// @route   PUT /api/grade-pays/:id
// @access  Private (Admin)
const update = async (req, res) => {
  try {
    const item = await GradePay.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Grade pay not found' });

    const { amount, isActive } = req.body;
    if (amount !== undefined) item.amount = Number(amount);
    if (isActive !== undefined) item.isActive = !!isActive;
    item.modifyDate = new Date();

    const updated = await item.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete grade pay
// @route   DELETE /api/grade-pays/:id
// @access  Private (Admin)
const remove = async (req, res) => {
  try {
    const item = await GradePay.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Grade pay not found' });
    res.json({ message: 'Grade pay deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
