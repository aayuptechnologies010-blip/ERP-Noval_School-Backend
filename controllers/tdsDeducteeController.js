const TDSDeductee = require('../models/tdsDeducteeModel');

// @desc    Get all TDS Deductees
// @route   GET /api/tds-deductee
// @access  Private (Admin)
const getAll = async (req, res) => {
  try {
    const deductees = await TDSDeductee.find().sort({ isPrimary: -1, createdAt: -1 });
    res.json(deductees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get primary TDS Deductee
// @route   GET /api/tds-deductee/primary
// @access  Private (Admin)
const getPrimary = async (req, res) => {
  try {
    let deductee = await TDSDeductee.findOne({ isPrimary: true });
    if (!deductee) {
      deductee = await TDSDeductee.findOne().sort({ createdAt: -1 });
    }
    res.json(deductee || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new TDS Deductee
// @route   POST /api/tds-deductee
// @access  Private (Admin)
const create = async (req, res) => {
  try {
    const { name, fatherName, designation, place, pan, tan, isPrimary } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (isPrimary) {
      await TDSDeductee.updateMany({}, { isPrimary: false });
    }

    const deductee = new TDSDeductee({
      name,
      fatherName: fatherName || '',
      designation: designation || '',
      place: place || '',
      pan: pan || '',
      tan: tan || '',
      isPrimary: isPrimary !== undefined ? !!isPrimary : true
    });

    const saved = await deductee.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update TDS Deductee
// @route   PUT /api/tds-deductee/:id
// @access  Private (Admin)
const update = async (req, res) => {
  try {
    const deductee = await TDSDeductee.findById(req.params.id);
    if (!deductee) return res.status(404).json({ message: 'TDS Deductee not found' });

    const { name, fatherName, designation, place, pan, tan, isPrimary } = req.body;
    if (name !== undefined) deductee.name = name;
    if (fatherName !== undefined) deductee.fatherName = fatherName;
    if (designation !== undefined) deductee.designation = designation;
    if (place !== undefined) deductee.place = place;
    if (pan !== undefined) deductee.pan = pan;
    if (tan !== undefined) deductee.tan = tan;

    if (isPrimary) {
      await TDSDeductee.updateMany({ _id: { $ne: req.params.id } }, { isPrimary: false });
      deductee.isPrimary = true;
    } else if (isPrimary !== undefined) {
      deductee.isPrimary = false;
    }

    const updated = await deductee.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete TDS Deductee
// @route   DELETE /api/tds-deductee/:id
// @access  Private (Admin)
const remove = async (req, res) => {
  try {
    const deductee = await TDSDeductee.findByIdAndDelete(req.params.id);
    if (!deductee) return res.status(404).json({ message: 'TDS Deductee not found' });
    res.json({ message: 'TDS Deductee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  getPrimary,
  create,
  update,
  remove
};
