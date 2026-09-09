const ProspectusEntry = require('../models/prospectusEntryModel');

// @desc    Create a new prospectus entry
// @route   POST /api/prospectus-entries
// @access  Private
const createProspectusEntry = async (req, res) => {
  try {
    const { prospectusNo } = req.body;

    if (!prospectusNo) {
      return res.status(400).json({ message: 'Reg No./ Pros No. is required' });
    }

    const exists = await ProspectusEntry.findOne({ prospectusNo });

    if (exists) {
      return res.status(400).json({ message: 'Prospectus Number already exists' });
    }

    const prospectus = await ProspectusEntry.create(req.body);

    res.status(201).json(prospectus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all prospectus entries
// @route   GET /api/prospectus-entries
// @access  Private
const getProspectusEntries = async (req, res) => {
  try {
    const filter = {};
    if (req.query.session) filter.session = req.query.session;
    if (req.query.studentClass) filter.studentClass = req.query.studentClass;
    if (req.query.enquiryNo) filter.enquiryNo = req.query.enquiryNo;
    
    const entries = await ProspectusEntry.find(filter)
      .populate('session', 'name')
      .populate('enquiryRef')
      .populate('stationaryItems.stationary')
      .sort({ createdAt: -1 });
      
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get prospectus entry by ID
// @route   GET /api/prospectus-entries/:id
// @access  Private
const getProspectusEntryById = async (req, res) => {
  try {
    const entry = await ProspectusEntry.findById(req.params.id)
      .populate('session', 'name')
      .populate('enquiryRef')
      .populate('stationaryItems.stationary');
      
    if (!entry) {
      return res.status(404).json({ message: 'Prospectus Entry not found' });
    }
    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a prospectus entry
// @route   PUT /api/prospectus-entries/:id
// @access  Private
const updateProspectusEntry = async (req, res) => {
  try {
    const { prospectusNo } = req.body;
    const entry = await ProspectusEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Prospectus Entry not found' });
    }

    if (prospectusNo && prospectusNo !== entry.prospectusNo) {
      const exists = await ProspectusEntry.findOne({ prospectusNo });
      if (exists) {
        return res.status(400).json({ message: 'Prospectus Number already in use' });
      }
    }

    // Update dynamically
    for (const key in req.body) {
      entry[key] = req.body[key];
    }

    const updatedEntry = await entry.save();
    res.status(200).json(updatedEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a prospectus entry
// @route   DELETE /api/prospectus-entries/:id
// @access  Private
const deleteProspectusEntry = async (req, res) => {
  try {
    const entry = await ProspectusEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Prospectus Entry not found' });
    }

    await entry.deleteOne();
    res.status(200).json({ message: 'Prospectus Entry removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProspectusEntry,
  getProspectusEntries,
  getProspectusEntryById,
  updateProspectusEntry,
  deleteProspectusEntry
};
