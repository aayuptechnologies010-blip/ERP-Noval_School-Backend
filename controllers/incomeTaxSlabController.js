const IncomeTaxSlab = require('../models/incomeTaxSlabModel');

// @desc    Get all income tax slabs
// @route   GET /api/income-tax-slabs
// @access  Private (Admin)
const getAll = async (req, res) => {
  try {
    const { slabType, groupName } = req.query;
    const filter = {};
    if (slabType) filter.slabType = slabType;
    if (groupName) filter.groupName = groupName;

    const slabs = await IncomeTaxSlab.find(filter).sort({ slabType: 1, groupName: 1, groupSlNo: 1, lowerBound: 1 });
    res.json(slabs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single income tax slab
// @route   GET /api/income-tax-slabs/:id
// @access  Private (Admin)
const getById = async (req, res) => {
  try {
    const slab = await IncomeTaxSlab.findById(req.params.id);
    if (!slab) return res.status(404).json({ message: 'Income Tax Slab not found' });
    res.json(slab);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new income tax slab
// @route   POST /api/income-tax-slabs
// @access  Private (Admin)
const create = async (req, res) => {
  try {
    const { slabType, groupName, groupSlNo, lowerBound, upperBound, taxRate, isActive } = req.body;
    if (!groupName) {
      return res.status(400).json({ message: 'Group Name is required' });
    }

    const slab = new IncomeTaxSlab({
      slabType: slabType || 'Tax payable in Existing Regime',
      groupName,
      groupSlNo: Number(groupSlNo) || 1,
      lowerBound: Number(lowerBound) || 0,
      upperBound: Number(upperBound) || 0,
      taxRate: Number(taxRate) || 0,
      isActive: isActive !== undefined ? !!isActive : true
    });

    const saved = await slab.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update income tax slab
// @route   PUT /api/income-tax-slabs/:id
// @access  Private (Admin)
const update = async (req, res) => {
  try {
    const slab = await IncomeTaxSlab.findById(req.params.id);
    if (!slab) return res.status(404).json({ message: 'Income Tax Slab not found' });

    const { slabType, groupName, groupSlNo, lowerBound, upperBound, taxRate, isActive } = req.body;
    if (slabType !== undefined) slab.slabType = slabType;
    if (groupName !== undefined) slab.groupName = groupName;
    if (groupSlNo !== undefined) slab.groupSlNo = Number(groupSlNo);
    if (lowerBound !== undefined) slab.lowerBound = Number(lowerBound);
    if (upperBound !== undefined) slab.upperBound = Number(upperBound);
    if (taxRate !== undefined) slab.taxRate = Number(taxRate);
    if (isActive !== undefined) slab.isActive = !!isActive;

    const updated = await slab.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete income tax slab
// @route   DELETE /api/income-tax-slabs/:id
// @access  Private (Admin)
const remove = async (req, res) => {
  try {
    const slab = await IncomeTaxSlab.findByIdAndDelete(req.params.id);
    if (!slab) return res.status(404).json({ message: 'Income Tax Slab not found' });
    res.json({ message: 'Income Tax Slab deleted successfully' });
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
