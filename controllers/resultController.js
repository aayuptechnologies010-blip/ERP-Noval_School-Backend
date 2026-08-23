const Result = require('../models/resultModel');
const Exam = require('../models/examModel');
const Student = require('../models/studentModel');

// @desc    Add or update a result for a student in a specific exam and subject
// @route   POST /api/results
// @access  Private (Admin/Teacher)
const addResult = async (req, res) => {
  try {
    const { studentId, examId, subject, maxMarks, marksObtained, grade, remarks } = req.body;

    const student = await Student.findById(studentId);
    const exam = await Exam.findById(examId);

    if (!student || !exam) {
      return res.status(404).json({ message: 'Student or Exam not found' });
    }

    // Check if result already exists
    let result = await Result.findOne({ student: studentId, exam: examId, subject });

    if (result) {
      // Update existing result
      result.maxMarks = maxMarks;
      result.marksObtained = marksObtained;
      result.grade = grade;
      result.remarks = remarks;
      await result.save();
      return res.json({ message: 'Result updated successfully', result });
    } else {
      // Create new result
      result = await Result.create({
        student: studentId,
        exam: examId,
        subject,
        maxMarks,
        marksObtained,
        grade,
        remarks
      });
      return res.status(201).json({ message: 'Result added successfully', result });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Result for this subject already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all results for a specific student (Report Card)
// @route   GET /api/results/student/:studentId
// @access  Private
const getStudentResults = async (req, res) => {
  try {
    const { examId } = req.query; // Optional filter by specific exam
    
    let query = { student: req.params.studentId };
    if (examId) query.exam = examId;

    const results = await Result.find(query)
      .populate('exam', 'examName term startDate endDate')
      .sort('exam subject');
      
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get results for an entire class for a specific exam
// @route   GET /api/results/class
// @access  Private
const getClassResults = async (req, res) => {
  try {
    const { className, section, examId } = req.query;

    if (!className || !examId) {
      return res.status(400).json({ message: 'Class name and Exam ID are required' });
    }

    // Find all students in this class/section
    let studentQuery = { 'academicDetails.class': className };
    if (section) studentQuery['academicDetails.section'] = section;

    const students = await Student.find(studentQuery).select('_id personalDetails.firstName personalDetails.lastName academicDetails.rollNumber');
    const studentIds = students.map(s => s._id);

    // Fetch results for these students for the given exam
    const results = await Result.find({
      student: { $in: studentIds },
      exam: examId
    }).populate('student', 'personalDetails.firstName personalDetails.lastName academicDetails.rollNumber');

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a specific result entry
// @route   DELETE /api/results/:id
// @access  Private (Admin)
const deleteResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Result not found' });

    await result.deleteOne();
    res.json({ message: 'Result entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addResult,
  getStudentResults,
  getClassResults,
  deleteResult
};
