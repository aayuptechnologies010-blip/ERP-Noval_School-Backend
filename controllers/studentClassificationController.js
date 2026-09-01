const StudentClassification = require('../models/studentClassificationModel');

// @desc    Create a new student classification
// @route   POST /api/student-classifications
// @access  Private
const createClassification = async (req, res) => {
  try {
    const { classificationName } = req.body;

    if (!classificationName) {
      return res.status(400).json({ message: 'Classification name is required' });
    }

    const exists = await StudentClassification.findOne({ classificationName: { $regex: new RegExp(`^${classificationName}$`, 'i') } });

    if (exists) {
      return res.status(400).json({ message: 'Classification already exists' });
    }

    const classification = await StudentClassification.create({
      classificationName
    });

    res.status(201).json(classification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all student classifications
// @route   GET /api/student-classifications
// @access  Private
const getClassifications = async (req, res) => {
  try {
    const classifications = await StudentClassification.find({}).sort({ createdAt: -1 });
    res.status(200).json(classifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student classification by ID
// @route   GET /api/student-classifications/:id
// @access  Private
const getClassificationById = async (req, res) => {
  try {
    const classification = await StudentClassification.findById(req.params.id);
    if (!classification) {
      return res.status(404).json({ message: 'Classification not found' });
    }
    res.status(200).json(classification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a student classification
// @route   PUT /api/student-classifications/:id
// @access  Private
const updateClassification = async (req, res) => {
  try {
    const { classificationName, isActive } = req.body;
    const classification = await StudentClassification.findById(req.params.id);

    if (!classification) {
      return res.status(404).json({ message: 'Classification not found' });
    }

    if (classificationName && classificationName.toLowerCase() !== classification.classificationName.toLowerCase()) {
      const exists = await StudentClassification.findOne({ classificationName: { $regex: new RegExp(`^${classificationName}$`, 'i') } });
      if (exists) {
        return res.status(400).json({ message: 'Classification name already in use' });
      }
    }

    if (classificationName) classification.classificationName = classificationName;
    if (isActive !== undefined) classification.isActive = isActive;

    const updatedClassification = await classification.save();
    res.status(200).json(updatedClassification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a student classification
// @route   DELETE /api/student-classifications/:id
// @access  Private
const deleteClassification = async (req, res) => {
  try {
    const classification = await StudentClassification.findById(req.params.id);

    if (!classification) {
      return res.status(404).json({ message: 'Classification not found' });
    }

    await classification.deleteOne();
    res.status(200).json({ message: 'Classification removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createClassification,
  getClassifications,
  getClassificationById,
  updateClassification,
  deleteClassification
};
