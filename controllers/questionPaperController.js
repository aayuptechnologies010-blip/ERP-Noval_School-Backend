const QuestionPaper = require('../models/questionPaperModel');

// @desc    Create a new question paper
// @route   POST /api/question-papers
// @access  Private
const createQuestionPaper = async (req, res) => {
  try {
    const questionPaper = await QuestionPaper.create(req.body);
    res.status(201).json(questionPaper);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all question papers
// @route   GET /api/question-papers
// @access  Private
const getQuestionPapers = async (req, res) => {
  try {
    const papers = await QuestionPaper.find().sort({ date: -1 });

    // Calculate Summary Stats
    const totalPapers = papers.length;
    const published = papers.filter(p => p.status === 'Published').length;
    const draft = papers.filter(p => p.status === 'Draft').length;

    res.json({
      summary: {
        totalPapers,
        published,
        draft
      },
      papers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a specific question paper
// @route   GET /api/question-papers/:id
// @access  Private
const getQuestionPaperById = async (req, res) => {
  try {
    const questionPaper = await QuestionPaper.findById(req.params.id);
    if (!questionPaper) {
      return res.status(404).json({ message: 'Question paper not found' });
    }
    res.json(questionPaper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a question paper
// @route   PUT /api/question-papers/:id
// @access  Private
const updateQuestionPaper = async (req, res) => {
  try {
    const questionPaper = await QuestionPaper.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!questionPaper) {
      return res.status(404).json({ message: 'Question paper not found' });
    }
    res.json(questionPaper);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a question paper
// @route   DELETE /api/question-papers/:id
// @access  Private
const deleteQuestionPaper = async (req, res) => {
  try {
    const questionPaper = await QuestionPaper.findByIdAndDelete(req.params.id);
    if (!questionPaper) {
      return res.status(404).json({ message: 'Question paper not found' });
    }
    res.json({ message: 'Question paper deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createQuestionPaper,
  getQuestionPapers,
  getQuestionPaperById,
  updateQuestionPaper,
  deleteQuestionPaper
};
