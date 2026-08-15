const StudentInfraction = require('../models/studentInfractionModel');

// @desc    Record a student infraction
// @route   POST /api/student-infractions
// @access  Private
const createStudentInfraction = async (req, res) => {
  try {
    const { studentName, rollNo, studentClass, date, infractionType, severity, consequence, notes } = req.body;

    if (!studentName || !rollNo || !studentClass || !date || !infractionType || !severity || !consequence) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const infraction = await StudentInfraction.create({
      studentName,
      rollNo,
      studentClass,
      date,
      infractionType,
      severity,
      consequence,
      notes,
      createdBy: req.user ? req.user._id : undefined
    });

    res.status(201).json(infraction);
  } catch (error) {
    res.status(500).json({ message: 'Error recording student infraction', error: error.message });
  }
};

// @desc    Get all student infractions
// @route   GET /api/student-infractions
// @access  Private
const getStudentInfractions = async (req, res) => {
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

    const infractions = await StudentInfraction.find(filter).sort({ date: -1 });
    res.status(200).json(infractions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student infractions', error: error.message });
  }
};

// @desc    Get a single student infraction by ID
// @route   GET /api/student-infractions/:id
// @access  Private
const getStudentInfractionById = async (req, res) => {
  try {
    const infraction = await StudentInfraction.findById(req.params.id);
    if (!infraction) {
      return res.status(404).json({ message: 'Student infraction not found' });
    }
    res.status(200).json(infraction);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student infraction', error: error.message });
  }
};

// @desc    Update a student infraction
// @route   PUT /api/student-infractions/:id
// @access  Private
const updateStudentInfraction = async (req, res) => {
  try {
    const { studentName, rollNo, studentClass, date, infractionType, severity, consequence, notes } = req.body;
    
    const infraction = await StudentInfraction.findByIdAndUpdate(
      req.params.id,
      { studentName, rollNo, studentClass, date, infractionType, severity, consequence, notes },
      { new: true, runValidators: true }
    );

    if (!infraction) {
      return res.status(404).json({ message: 'Student infraction not found' });
    }
    
    res.status(200).json(infraction);
  } catch (error) {
    res.status(500).json({ message: 'Error updating student infraction', error: error.message });
  }
};

// @desc    Delete a student infraction
// @route   DELETE /api/student-infractions/:id
// @access  Private
const deleteStudentInfraction = async (req, res) => {
  try {
    const infraction = await StudentInfraction.findByIdAndDelete(req.params.id);
    if (!infraction) {
      return res.status(404).json({ message: 'Student infraction not found' });
    }
    res.status(200).json({ message: 'Student infraction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student infraction', error: error.message });
  }
};

module.exports = {
  createStudentInfraction,
  getStudentInfractions,
  getStudentInfractionById,
  updateStudentInfraction,
  deleteStudentInfraction
};
