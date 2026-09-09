const PayScale = require('../models/payScaleModel');

// @desc    Get all pay scales
// @route   GET /api/pay-scales
// @access  Private (Admin)
const getAll = async (req, res) => {
  try {
    const scales = await PayScale.find().sort({ createdAt: -1 });
    res.json(scales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single pay scale
// @route   GET /api/pay-scales/:id
// @access  Private (Admin)
const getById = async (req, res) => {
  try {
    const scale = await PayScale.findById(req.params.id);
    if (!scale) return res.status(404).json({ message: 'Pay scale not found' });
    res.json(scale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create pay scale
// @route   POST /api/pay-scales
// @access  Private (Admin)
const create = async (req, res) => {
  try {
    const { scale, isActive } = req.body;
    if (!scale) {
      return res.status(400).json({ message: 'Pay Scale is required' });
    }

    const exists = await PayScale.findOne({ scale });
    if (exists) {
      return res.status(400).json({ message: 'Pay Scale already exists' });
    }

    const newScale = new PayScale({
      scale,
      modifyDate: new Date(),
      isActive: isActive !== undefined ? !!isActive : true
    });

    const saved = await newScale.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update pay scale
// @route   PUT /api/pay-scales/:id
// @access  Private (Admin)
const update = async (req, res) => {
  try {
    const item = await PayScale.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Pay scale not found' });

    const { scale, isActive } = req.body;
    if (scale !== undefined) item.scale = scale;
    if (isActive !== undefined) item.isActive = !!isActive;
    item.modifyDate = new Date();

    const updated = await item.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete pay scale
// @route   DELETE /api/pay-scales/:id
// @access  Private (Admin)
const remove = async (req, res) => {
  try {
    const item = await PayScale.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Pay scale not found' });
    res.json({ message: 'Pay scale deleted successfully' });
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
