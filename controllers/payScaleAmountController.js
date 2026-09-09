const PayScaleAmount = require('../models/payScaleAmountModel');

// @desc    Get all pay scale amounts
// @route   GET /api/pay-scale-amounts
// @access  Private (Admin)
const getAll = async (req, res) => {
  try {
    const { scale } = req.query;
    const filter = {};
    if (scale) filter.scale = scale;

    const amounts = await PayScaleAmount.find(filter).sort({ scale: 1, amount: 1 });
    res.json(amounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single pay scale amount
// @route   GET /api/pay-scale-amounts/:id
// @access  Private (Admin)
const getById = async (req, res) => {
  try {
    const item = await PayScaleAmount.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Pay scale amount not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create pay scale amount
// @route   POST /api/pay-scale-amounts
// @access  Private (Admin)
const create = async (req, res) => {
  try {
    const { scale, amount, isActive } = req.body;
    if (!scale || amount === undefined) {
      return res.status(400).json({ message: 'Pay Scale and Amount are required' });
    }

    const newAmount = new PayScaleAmount({
      scale,
      amount: Number(amount) || 0,
      modifyDate: new Date(),
      isActive: isActive !== undefined ? !!isActive : true
    });

    const saved = await newAmount.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update pay scale amount
// @route   PUT /api/pay-scale-amounts/:id
// @access  Private (Admin)
const update = async (req, res) => {
  try {
    const item = await PayScaleAmount.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Pay scale amount not found' });

    const { scale, amount, isActive } = req.body;
    if (scale !== undefined) item.scale = scale;
    if (amount !== undefined) item.amount = Number(amount);
    if (isActive !== undefined) item.isActive = !!isActive;
    item.modifyDate = new Date();

    const updated = await item.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete pay scale amount
// @route   DELETE /api/pay-scale-amounts/:id
// @access  Private (Admin)
const remove = async (req, res) => {
  try {
    const item = await PayScaleAmount.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Pay scale amount not found' });
    res.json({ message: 'Pay scale amount deleted successfully' });
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
