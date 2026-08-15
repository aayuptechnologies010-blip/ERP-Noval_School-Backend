const StudentAppreciation = require('../models/studentAppreciationModel');

// @desc    Give appreciation to a student
// @route   POST /api/student-appreciations
// @access  Private
const createStudentAppreciation = async (req, res) => {
  try {
    const { studentName, rollNo, studentClass, appreciationType, points, date } = req.body;

    if (!studentName || !rollNo || !studentClass || !appreciationType || points === undefined || !date) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const appreciation = await StudentAppreciation.create({
      studentName,
      rollNo,
      studentClass,
      appreciationType,
      points,
      date,
      createdBy: req.user ? req.user._id : undefined
    });

    res.status(201).json(appreciation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating student appreciation', error: error.message });
  }
};

// @desc    Get all student appreciations
// @route   GET /api/student-appreciations
// @access  Private
const getStudentAppreciations = async (req, res) => {
  try {
    const { search, studentClass } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (studentClass && studentClass !== 'All') {
      filter.studentClass = studentClass;
    }

    const appreciations = await StudentAppreciation.find(filter).sort({ date: -1 });
    res.status(200).json(appreciations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student appreciations', error: error.message });
  }
};

// @desc    Get a single student appreciation by ID
// @route   GET /api/student-appreciations/:id
// @access  Private
const getStudentAppreciationById = async (req, res) => {
  try {
    const appreciation = await StudentAppreciation.findById(req.params.id);
    if (!appreciation) {
      return res.status(404).json({ message: 'Student appreciation not found' });
    }
    res.status(200).json(appreciation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student appreciation', error: error.message });
  }
};

// @desc    Update a student appreciation
// @route   PUT /api/student-appreciations/:id
// @access  Private
const updateStudentAppreciation = async (req, res) => {
  try {
    const { studentName, rollNo, studentClass, appreciationType, points, date } = req.body;
    
    const appreciation = await StudentAppreciation.findByIdAndUpdate(
      req.params.id,
      { studentName, rollNo, studentClass, appreciationType, points, date },
      { new: true, runValidators: true }
    );

    if (!appreciation) {
      return res.status(404).json({ message: 'Student appreciation not found' });
    }
    
    res.status(200).json(appreciation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating student appreciation', error: error.message });
  }
};

// @desc    Delete a student appreciation
// @route   DELETE /api/student-appreciations/:id
// @access  Private
const deleteStudentAppreciation = async (req, res) => {
  try {
    const appreciation = await StudentAppreciation.findByIdAndDelete(req.params.id);
    if (!appreciation) {
      return res.status(404).json({ message: 'Student appreciation not found' });
    }
    res.status(200).json({ message: 'Student appreciation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student appreciation', error: error.message });
  }
};

module.exports = {
  createStudentAppreciation,
  getStudentAppreciations,
  getStudentAppreciationById,
  updateStudentAppreciation,
  deleteStudentAppreciation
};
