const ITHeadGroup = require('../models/itHeadGroupModel');

// @desc    Get all IT head groups
// @route   GET /api/it-head-groups
// @access  Private (Admin)
const getAll = async (req, res) => {
  try {
    const groups = await ITHeadGroup.find().sort({ groupSlNo: 1, createdAt: 1 });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single IT head group
// @route   GET /api/it-head-groups/:id
// @access  Private (Admin)
const getById = async (req, res) => {
  try {
    const group = await ITHeadGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'IT Head Group not found' });
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create IT head group
// @route   POST /api/it-head-groups
// @access  Private (Admin)
const create = async (req, res) => {
  try {
    const { groupSlNo, groupName, maxRebateLimit, percentage, isActive } = req.body;
    if (!groupName) {
      return res.status(400).json({ message: 'Group Name is required' });
    }

    const group = new ITHeadGroup({
      groupSlNo: Number(groupSlNo) || 1,
      groupName,
      maxRebateLimit: Number(maxRebateLimit) || 0,
      percentage: Number(percentage) !== undefined ? Number(percentage) : 100,
      modifyDate: new Date(),
      isActive: isActive !== undefined ? !!isActive : true
    });

    const saved = await group.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update IT head group
// @route   PUT /api/it-head-groups/:id
// @access  Private (Admin)
const update = async (req, res) => {
  try {
    const group = await ITHeadGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'IT Head Group not found' });

    const { groupSlNo, groupName, maxRebateLimit, percentage, isActive } = req.body;
    if (groupSlNo !== undefined) group.groupSlNo = Number(groupSlNo);
    if (groupName !== undefined) group.groupName = groupName;
    if (maxRebateLimit !== undefined) group.maxRebateLimit = Number(maxRebateLimit);
    if (percentage !== undefined) group.percentage = Number(percentage);
    if (isActive !== undefined) group.isActive = !!isActive;
    group.modifyDate = new Date();

    const updated = await group.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete IT head group
// @route   DELETE /api/it-head-groups/:id
// @access  Private (Admin)
const remove = async (req, res) => {
  try {
    const group = await ITHeadGroup.findByIdAndDelete(req.params.id);
    if (!group) return res.status(404).json({ message: 'IT Head Group not found' });
    res.json({ message: 'IT Head Group deleted successfully' });
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
