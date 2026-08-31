const ClassSection = require('../models/classSectionModel');

// @desc    Create a new class section relation
// @route   POST /api/class-sections
// @access  Private
const createClassSection = async (req, res) => {
  try {
    const { className, sections } = req.body;

    if (!className) {
      return res.status(400).json({ message: 'Class name is required' });
    }

    const relationExists = await ClassSection.findOne({ className: className.toUpperCase() });

    if (relationExists) {
      // If it exists, update it instead of failing, as relation mappings often get updated
      relationExists.sections = sections || [];
      const updatedRelation = await relationExists.save();
      return res.status(200).json(updatedRelation);
    }

    const relation = await ClassSection.create({
      className: className.toUpperCase(),
      sections: sections || []
    });

    res.status(201).json(relation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all class section relations
// @route   GET /api/class-sections
// @access  Private
const getClassSections = async (req, res) => {
  try {
    const relations = await ClassSection.find({}).sort({ createdAt: -1 });
    res.status(200).json(relations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get section relations by ID
// @route   GET /api/class-sections/:id
// @access  Private
const getClassSectionById = async (req, res) => {
  try {
    const relation = await ClassSection.findById(req.params.id);
    if (!relation) {
      return res.status(404).json({ message: 'Class Section relation not found' });
    }
    res.status(200).json(relation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sections related to a specific class name
// @route   GET /api/class-sections/class/:className
// @access  Private
const getSectionsByClassName = async (req, res) => {
  try {
    const relation = await ClassSection.findOne({ className: req.params.className.toUpperCase() });
    
    if (!relation) {
      return res.status(404).json({ message: 'No sections found for this class' });
    }
    
    res.status(200).json(relation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Delete a class section relation
// @route   DELETE /api/class-sections/:id
// @access  Private
const deleteClassSection = async (req, res) => {
  try {
    const relation = await ClassSection.findById(req.params.id);

    if (!relation) {
      return res.status(404).json({ message: 'Relation not found' });
    }

    await relation.deleteOne();
    res.status(200).json({ message: 'Relation removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createClassSection,
  getClassSections,
  getClassSectionById,
  getSectionsByClassName,
  deleteClassSection
};
