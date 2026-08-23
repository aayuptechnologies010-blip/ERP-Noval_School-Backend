const Exam = require('../models/examModel');

// @desc    Create a new exam schedule
// @route   POST /api/exams
// @access  Private (Admin/Teacher)
const createExam = async (req, res) => {
  try {
    const { examName, term, startDate, endDate, applicableClasses, remarks } = req.body;

    const exam = await Exam.create({
      examName,
      term,
      startDate,
      endDate,
      applicableClasses,
      remarks
    });

    res.status(201).json({ message: 'Exam scheduled successfully', exam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all exams (with optional class filter)
// @route   GET /api/exams
// @access  Private
const getAllExams = async (req, res) => {
  try {
    const { className, status } = req.query;
    
    // Auto-update exam status based on dates before returning
    const currentDate = new Date();
    await Exam.updateMany(
      { status: 'Upcoming', startDate: { $lte: currentDate }, endDate: { $gte: currentDate } },
      { $set: { status: 'Ongoing' } }
    );
    await Exam.updateMany(
      { status: { $in: ['Upcoming', 'Ongoing'] }, endDate: { $lt: currentDate } },
      { $set: { status: 'Completed' } }
    );

    let query = {};
    if (className) query.applicableClasses = className;
    if (status) query.status = status;

    const exams = await Exam.find(query).sort('-startDate');
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get exam by ID
// @route   GET /api/exams/:id
// @access  Private
const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update exam details
// @route   PUT /api/exams/:id
// @access  Private (Admin)
const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json({ message: 'Exam updated successfully', exam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an exam
// @route   DELETE /api/exams/:id
// @access  Private (Admin)
const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    await exam.deleteOne();
    res.json({ message: 'Exam schedule deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam
};
