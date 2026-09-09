const ITHead = require('../models/itHeadModel');

// @desc    Get all IT heads
// @route   GET /api/it-heads
// @access  Private (Admin)
const getAll = async (req, res) => {
  try {
    const { groupName } = req.query;
    const filter = {};
    if (groupName) filter.groupName = groupName;

    const heads = await ITHead.find(filter).sort({ groupName: 1, slNo: 1, createdAt: 1 });
    res.json(heads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single IT head
// @route   GET /api/it-heads/:id
// @access  Private (Admin)
const getById = async (req, res) => {
  try {
    const head = await ITHead.findById(req.params.id);
    if (!head) return res.status(404).json({ message: 'IT Head not found' });
    res.json(head);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create IT head
// @route   POST /api/it-heads
// @access  Private (Admin)
const create = async (req, res) => {
  try {
    const { groupId, groupName, slNo, headName, reportName, maxRebateLimit, isActive } = req.body;
    if (!groupName || !headName) {
      return res.status(400).json({ message: 'Group Name and Head Name are required' });
    }

    const head = new ITHead({
      groupId: groupId || null,
      groupName,
      slNo: Number(slNo) || 1,
      headName,
      reportName: reportName || '',
      maxRebateLimit: Number(maxRebateLimit) || 0,
      modifyDate: new Date(),
      isActive: isActive !== undefined ? !!isActive : true
    });

    const saved = await head.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update IT head
// @route   PUT /api/it-heads/:id
// @access  Private (Admin)
const update = async (req, res) => {
  try {
    const head = await ITHead.findById(req.params.id);
    if (!head) return res.status(404).json({ message: 'IT Head not found' });

    const { groupId, groupName, slNo, headName, reportName, maxRebateLimit, isActive } = req.body;
    if (groupId !== undefined) head.groupId = groupId;
    if (groupName !== undefined) head.groupName = groupName;
    if (slNo !== undefined) head.slNo = Number(slNo);
    if (headName !== undefined) head.headName = headName;
    if (reportName !== undefined) head.reportName = reportName;
    if (maxRebateLimit !== undefined) head.maxRebateLimit = Number(maxRebateLimit);
    if (isActive !== undefined) head.isActive = !!isActive;
    head.modifyDate = new Date();

    const updated = await head.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete IT head
// @route   DELETE /api/it-heads/:id
// @access  Private (Admin)
const remove = async (req, res) => {
  try {
    const head = await ITHead.findByIdAndDelete(req.params.id);
    if (!head) return res.status(404).json({ message: 'IT Head not found' });
    res.json({ message: 'IT Head deleted successfully' });
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
