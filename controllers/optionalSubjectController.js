const OptionalSubject = require('../models/optionalSubjectModel');

// @desc    Create a new optional subject
// @route   POST /api/optional-subjects
// @access  Private
const createOptionalSubject = async (req, res) => {
  try {
    const { subjectName } = req.body;

    if (!subjectName) {
      return res.status(400).json({ message: 'Subject name is required' });
    }

    const subjectExists = await OptionalSubject.findOne({ subjectName: subjectName.toUpperCase() });

    if (subjectExists) {
      return res.status(400).json({ message: 'Optional subject already exists' });
    }

    const subject = await OptionalSubject.create({
      subjectName: subjectName.toUpperCase()
    });

    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all optional subjects
// @route   GET /api/optional-subjects
// @access  Private
const getOptionalSubjects = async (req, res) => {
  try {
    const subjects = await OptionalSubject.find({}).sort({ createdAt: -1 });
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get optional subject by ID
// @route   GET /api/optional-subjects/:id
// @access  Private
const getOptionalSubjectById = async (req, res) => {
  try {
    const subject = await OptionalSubject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Optional subject not found' });
    }
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an optional subject
// @route   PUT /api/optional-subjects/:id
// @access  Private
const updateOptionalSubject = async (req, res) => {
  try {
    const { subjectName, isActive } = req.body;
    const subject = await OptionalSubject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: 'Optional subject not found' });
    }

    if (subjectName && subjectName.toUpperCase() !== subject.subjectName) {
      const subjectExists = await OptionalSubject.findOne({ subjectName: subjectName.toUpperCase() });
      if (subjectExists) {
        return res.status(400).json({ message: 'Subject name already in use' });
      }
    }

    if (subjectName) subject.subjectName = subjectName.toUpperCase();
    if (isActive !== undefined) subject.isActive = isActive;

    const updatedSubject = await subject.save();
    res.status(200).json(updatedSubject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an optional subject
// @route   DELETE /api/optional-subjects/:id
// @access  Private
const deleteOptionalSubject = async (req, res) => {
  try {
    const subject = await OptionalSubject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: 'Optional subject not found' });
    }

    await subject.deleteOne();
    res.status(200).json({ message: 'Optional subject removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOptionalSubject,
  getOptionalSubjects,
  getOptionalSubjectById,
  updateOptionalSubject,
  deleteOptionalSubject
};
