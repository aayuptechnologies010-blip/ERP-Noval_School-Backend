const ParentsStatus = require('../models/parentsStatusModel');

// @desc    Create a new parents status
// @route   POST /api/parents-statuses
// @access  Private
const createParentsStatus = async (req, res) => {
  try {
    const { statusName } = req.body;

    if (!statusName) {
      return res.status(400).json({ message: 'Parents status name is required' });
    }

    const statusExists = await ParentsStatus.findOne({ statusName: { $regex: new RegExp(`^${statusName}$`, 'i') } });

    if (statusExists) {
      return res.status(400).json({ message: 'Parents status already exists' });
    }

    const parentsStatus = await ParentsStatus.create({
      statusName
    });

    res.status(201).json(parentsStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all parents statuses
// @route   GET /api/parents-statuses
// @access  Private
const getParentsStatuses = async (req, res) => {
  try {
    const statuses = await ParentsStatus.find({}).sort({ createdAt: -1 });
    res.status(200).json(statuses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get parents status by ID
// @route   GET /api/parents-statuses/:id
// @access  Private
const getParentsStatusById = async (req, res) => {
  try {
    const parentsStatus = await ParentsStatus.findById(req.params.id);
    if (!parentsStatus) {
      return res.status(404).json({ message: 'Parents status not found' });
    }
    res.status(200).json(parentsStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a parents status
// @route   PUT /api/parents-statuses/:id
// @access  Private
const updateParentsStatus = async (req, res) => {
  try {
    const { statusName, isActive } = req.body;
    const parentsStatus = await ParentsStatus.findById(req.params.id);

    if (!parentsStatus) {
      return res.status(404).json({ message: 'Parents status not found' });
    }

    if (statusName && statusName.toLowerCase() !== parentsStatus.statusName.toLowerCase()) {
      const statusExists = await ParentsStatus.findOne({ statusName: { $regex: new RegExp(`^${statusName}$`, 'i') } });
      if (statusExists) {
        return res.status(400).json({ message: 'Parents status name already in use' });
      }
    }

    if (statusName) parentsStatus.statusName = statusName;
    if (isActive !== undefined) parentsStatus.isActive = isActive;

    const updatedParentsStatus = await parentsStatus.save();
    res.status(200).json(updatedParentsStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a parents status
// @route   DELETE /api/parents-statuses/:id
// @access  Private
const deleteParentsStatus = async (req, res) => {
  try {
    const parentsStatus = await ParentsStatus.findById(req.params.id);

    if (!parentsStatus) {
      return res.status(404).json({ message: 'Parents status not found' });
    }

    await parentsStatus.deleteOne();
    res.status(200).json({ message: 'Parents status removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createParentsStatus,
  getParentsStatuses,
  getParentsStatusById,
  updateParentsStatus,
  deleteParentsStatus
};
