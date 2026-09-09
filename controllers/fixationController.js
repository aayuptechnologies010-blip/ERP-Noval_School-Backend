const Fixation = require('../models/fixationModel');

// @desc    Get all fixations
// @route   GET /api/fixations
// @access  Private (Admin)
const getAll = async (req, res) => {
  try {
    const fixations = await Fixation.find().sort({ createdAt: -1 });
    res.json(fixations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single fixation
// @route   GET /api/fixations/:id
// @access  Private (Admin)
const getById = async (req, res) => {
  try {
    const item = await Fixation.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Fixation not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create fixation
// @route   POST /api/fixations
// @access  Private (Admin)
const create = async (req, res) => {
  try {
    const { scale, basicPercent, daPercent, gradePay, payScaleAmount, isActive } = req.body;
    if (!scale) {
      return res.status(400).json({ message: 'Pay Scale is required' });
    }

    const newFixation = new Fixation({
      scale,
      basicPercent: Number(basicPercent) || 0,
      daPercent: Number(daPercent) || 0,
      gradePay: Number(gradePay) || 0,
      payScaleAmount: Number(payScaleAmount) || 0,
      modifyDate: new Date(),
      isActive: isActive !== undefined ? !!isActive : true
    });

    const saved = await newFixation.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update fixation
// @route   PUT /api/fixations/:id
// @access  Private (Admin)
const update = async (req, res) => {
  try {
    const item = await Fixation.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Fixation not found' });

    const { scale, basicPercent, daPercent, gradePay, payScaleAmount, isActive } = req.body;
    if (scale !== undefined) item.scale = scale;
    if (basicPercent !== undefined) item.basicPercent = Number(basicPercent);
    if (daPercent !== undefined) item.daPercent = Number(daPercent);
    if (gradePay !== undefined) item.gradePay = Number(gradePay);
    if (payScaleAmount !== undefined) item.payScaleAmount = Number(payScaleAmount);
    if (isActive !== undefined) item.isActive = !!isActive;
    item.modifyDate = new Date();

    const updated = await item.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete fixation
// @route   DELETE /api/fixations/:id
// @access  Private (Admin)
const remove = async (req, res) => {
  try {
    const item = await Fixation.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Fixation not found' });
    res.json({ message: 'Fixation deleted successfully' });
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
