const Remark = require('../models/remarkModel');

// @desc    Create a new remark
// @route   POST /api/remarks
// @access  Private
const createRemark = async (req, res) => {
  try {
    const { remarkName } = req.body;

    if (!remarkName) {
      return res.status(400).json({ message: 'Remark name is required' });
    }

    const exists = await Remark.findOne({ remarkName: { $regex: new RegExp(`^${remarkName}$`, 'i') } });

    if (exists) {
      return res.status(400).json({ message: 'Remark already exists' });
    }

    const remark = await Remark.create({
      remarkName
    });

    res.status(201).json(remark);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all remarks
// @route   GET /api/remarks
// @access  Private
const getRemarks = async (req, res) => {
  try {
    const remarks = await Remark.find({}).sort({ createdAt: -1 });
    res.status(200).json(remarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get remark by ID
// @route   GET /api/remarks/:id
// @access  Private
const getRemarkById = async (req, res) => {
  try {
    const remark = await Remark.findById(req.params.id);
    if (!remark) {
      return res.status(404).json({ message: 'Remark not found' });
    }
    res.status(200).json(remark);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a remark
// @route   PUT /api/remarks/:id
// @access  Private
const updateRemark = async (req, res) => {
  try {
    const { remarkName, isActive } = req.body;
    const remark = await Remark.findById(req.params.id);

    if (!remark) {
      return res.status(404).json({ message: 'Remark not found' });
    }

    if (remarkName && remarkName.toLowerCase() !== remark.remarkName.toLowerCase()) {
      const exists = await Remark.findOne({ remarkName: { $regex: new RegExp(`^${remarkName}$`, 'i') } });
      if (exists) {
        return res.status(400).json({ message: 'Remark name already in use' });
      }
    }

    if (remarkName) remark.remarkName = remarkName;
    if (isActive !== undefined) remark.isActive = isActive;

    const updatedRemark = await remark.save();
    res.status(200).json(updatedRemark);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a remark
// @route   DELETE /api/remarks/:id
// @access  Private
const deleteRemark = async (req, res) => {
  try {
    const remark = await Remark.findById(req.params.id);

    if (!remark) {
      return res.status(404).json({ message: 'Remark not found' });
    }

    await remark.deleteOne();
    res.status(200).json({ message: 'Remark removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRemark,
  getRemarks,
  getRemarkById,
  updateRemark,
  deleteRemark
};
