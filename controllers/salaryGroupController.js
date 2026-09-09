const SalaryGroup = require('../models/salaryGroupModel');

// @desc    Get all salary groups
// @route   GET /api/salary-groups
// @access  Private (Admin)
const getAll = async (req, res) => {
  try {
    const groups = await SalaryGroup.find().sort({ createdAt: 1 });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get salary group by ID
// @route   GET /api/salary-groups/:id
// @access  Private (Admin)
const getById = async (req, res) => {
  try {
    const group = await SalaryGroup.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Salary group not found' });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create salary group
// @route   POST /api/salary-groups
// @access  Private (Admin)
const create = async (req, res) => {
  try {
    const { groupName, basicFrom, basicTo, gradePay, payScale, heads, isActive } = req.body;
    if (!groupName) {
      return res.status(400).json({ message: 'Group Name is required' });
    }

    const newGroup = await SalaryGroup.create({
      groupName,
      basicFrom: Number(basicFrom) || 0,
      basicTo: Number(basicTo) || 0,
      gradePay: Number(gradePay) || 0,
      payScale: payScale || '0.00',
      heads: heads || [],
      isActive: isActive !== undefined ? !!isActive : true
    });

    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update salary group
// @route   PUT /api/salary-groups/:id
// @access  Private (Admin)
const update = async (req, res) => {
  try {
    const group = await SalaryGroup.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Salary group not found' });
    }

    const { groupName, basicFrom, basicTo, gradePay, payScale, heads, isActive } = req.body;
    if (groupName !== undefined) group.groupName = groupName;
    if (basicFrom !== undefined) group.basicFrom = Number(basicFrom);
    if (basicTo !== undefined) group.basicTo = Number(basicTo);
    if (gradePay !== undefined) group.gradePay = Number(gradePay);
    if (payScale !== undefined) group.payScale = payScale;
    if (heads !== undefined) group.heads = heads;
    if (isActive !== undefined) group.isActive = !!isActive;

    const updated = await group.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save/Assign heads to a salary group
// @route   PUT /api/salary-groups/:id/heads
// @access  Private (Admin)
const saveGroupHeads = async (req, res) => {
  try {
    const group = await SalaryGroup.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Salary group not found' });
    }

    const { heads } = req.body;
    if (!heads || !Array.isArray(heads)) {
      return res.status(400).json({ message: 'heads array is required' });
    }

    group.heads = heads;
    const updated = await group.save();
    res.json({ message: 'Group heads saved successfully', group: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete salary group
// @route   DELETE /api/salary-groups/:id
// @access  Private (Admin)
const remove = async (req, res) => {
  try {
    const group = await SalaryGroup.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Salary group not found' });
    }

    await group.deleteOne();
    res.json({ message: 'Salary group deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  saveGroupHeads,
  remove
};
