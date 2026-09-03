const TermMaster = require('../models/termMasterModel');

// @desc    Create a new term master
// @route   POST /api/term-masters
// @access  Private
const createTermMaster = async (req, res) => {
  try {
    const { termName } = req.body;

    if (!termName) {
      return res.status(400).json({ message: 'Term name is required' });
    }

    const exists = await TermMaster.findOne({ termName: { $regex: new RegExp(`^${termName}$`, 'i') } });

    if (exists) {
      return res.status(400).json({ message: 'Term name already exists' });
    }

    const term = await TermMaster.create({
      termName
    });

    res.status(201).json(term);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all term masters
// @route   GET /api/term-masters
// @access  Private
const getTermMasters = async (req, res) => {
  try {
    const terms = await TermMaster.find({}).sort({ createdAt: -1 });
    res.status(200).json(terms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get term master by ID
// @route   GET /api/term-masters/:id
// @access  Private
const getTermMasterById = async (req, res) => {
  try {
    const term = await TermMaster.findById(req.params.id);
    if (!term) {
      return res.status(404).json({ message: 'Term not found' });
    }
    res.status(200).json(term);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a term master
// @route   PUT /api/term-masters/:id
// @access  Private
const updateTermMaster = async (req, res) => {
  try {
    const { termName, isActive } = req.body;
    const term = await TermMaster.findById(req.params.id);

    if (!term) {
      return res.status(404).json({ message: 'Term not found' });
    }

    if (termName && termName.toLowerCase() !== term.termName.toLowerCase()) {
      const exists = await TermMaster.findOne({ termName: { $regex: new RegExp(`^${termName}$`, 'i') } });
      if (exists) {
        return res.status(400).json({ message: 'Term name already in use' });
      }
    }

    if (termName) term.termName = termName;
    if (isActive !== undefined) term.isActive = isActive;

    const updatedTerm = await term.save();
    res.status(200).json(updatedTerm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a term master
// @route   DELETE /api/term-masters/:id
// @access  Private
const deleteTermMaster = async (req, res) => {
  try {
    const term = await TermMaster.findById(req.params.id);

    if (!term) {
      return res.status(404).json({ message: 'Term not found' });
    }

    await term.deleteOne();
    res.status(200).json({ message: 'Term removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTermMaster,
  getTermMasters,
  getTermMasterById,
  updateTermMaster,
  deleteTermMaster
};
