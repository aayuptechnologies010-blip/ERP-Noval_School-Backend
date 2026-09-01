const Reason = require('../models/reasonModel');

// @desc    Create a new reason
// @route   POST /api/reasons
// @access  Private
const createReason = async (req, res) => {
  try {
    const { reasonName } = req.body;

    if (!reasonName) {
      return res.status(400).json({ message: 'Reason name is required' });
    }

    const exists = await Reason.findOne({ reasonName: { $regex: new RegExp(`^${reasonName}$`, 'i') } });

    if (exists) {
      return res.status(400).json({ message: 'Reason already exists' });
    }

    const reason = await Reason.create({
      reasonName
    });

    res.status(201).json(reason);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reasons
// @route   GET /api/reasons
// @access  Private
const getReasons = async (req, res) => {
  try {
    const reasons = await Reason.find({}).sort({ createdAt: -1 });
    res.status(200).json(reasons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reason by ID
// @route   GET /api/reasons/:id
// @access  Private
const getReasonById = async (req, res) => {
  try {
    const reason = await Reason.findById(req.params.id);
    if (!reason) {
      return res.status(404).json({ message: 'Reason not found' });
    }
    res.status(200).json(reason);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a reason
// @route   PUT /api/reasons/:id
// @access  Private
const updateReason = async (req, res) => {
  try {
    const { reasonName, isActive } = req.body;
    const reason = await Reason.findById(req.params.id);

    if (!reason) {
      return res.status(404).json({ message: 'Reason not found' });
    }

    if (reasonName && reasonName.toLowerCase() !== reason.reasonName.toLowerCase()) {
      const exists = await Reason.findOne({ reasonName: { $regex: new RegExp(`^${reasonName}$`, 'i') } });
      if (exists) {
        return res.status(400).json({ message: 'Reason name already in use' });
      }
    }

    if (reasonName) reason.reasonName = reasonName;
    if (isActive !== undefined) reason.isActive = isActive;

    const updatedReason = await reason.save();
    res.status(200).json(updatedReason);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a reason
// @route   DELETE /api/reasons/:id
// @access  Private
const deleteReason = async (req, res) => {
  try {
    const reason = await Reason.findById(req.params.id);

    if (!reason) {
      return res.status(404).json({ message: 'Reason not found' });
    }

    await reason.deleteOne();
    res.status(200).json({ message: 'Reason removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReason,
  getReasons,
  getReasonById,
  updateReason,
  deleteReason
};
