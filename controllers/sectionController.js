const Section = require('../models/sectionModel');

// @desc    Create a new section
// @route   POST /api/sections
// @access  Private
const createSection = async (req, res) => {
  try {
    const { sectionName, orderNo } = req.body;

    if (!sectionName) {
      return res.status(400).json({ message: 'Section name is required' });
    }

    const sectionExists = await Section.findOne({ sectionName: sectionName.toUpperCase() });

    if (sectionExists) {
      return res.status(400).json({ message: 'Section already exists' });
    }

    const section = await Section.create({
      sectionName: sectionName.toUpperCase(),
      orderNo
    });

    res.status(201).json(section);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all sections
// @route   GET /api/sections
// @access  Private
const getSections = async (req, res) => {
  try {
    // Sort by orderNo first, then createdAt
    const sections = await Section.find({}).sort({ orderNo: 1, createdAt: -1 });
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get section by ID
// @route   GET /api/sections/:id
// @access  Private
const getSectionById = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.status(200).json(section);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a section
// @route   PUT /api/sections/:id
// @access  Private
const updateSection = async (req, res) => {
  try {
    const { sectionName, orderNo, isActive } = req.body;
    const section = await Section.findById(req.params.id);

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    if (sectionName && sectionName.toUpperCase() !== section.sectionName) {
      const sectionExists = await Section.findOne({ sectionName: sectionName.toUpperCase() });
      if (sectionExists) {
        return res.status(400).json({ message: 'Section name already in use' });
      }
    }

    if (sectionName) section.sectionName = sectionName.toUpperCase();
    if (orderNo !== undefined) section.orderNo = orderNo;
    if (isActive !== undefined) section.isActive = isActive;

    const updatedSection = await section.save();
    res.status(200).json(updatedSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a section
// @route   DELETE /api/sections/:id
// @access  Private
const deleteSection = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    await section.deleteOne();
    res.status(200).json({ message: 'Section removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSection,
  getSections,
  getSectionById,
  updateSection,
  deleteSection
};
