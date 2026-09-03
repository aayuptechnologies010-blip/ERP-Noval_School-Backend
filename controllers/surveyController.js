const Survey = require('../models/surveyModel');

// @desc    Create a new Survey
// @route   POST /api/surveys
// @access  Private (Admin)
const createSurvey = async (req, res) => {
  try {
    const { title, description, deadline, questions, isActive } = req.body;
    const survey = new Survey({
      title,
      description,
      deadline,
      questions,
      isActive,
      createdBy: req.user?._id
    });
    const saved = await survey.save();
    res.status(201).json({ message: 'Survey created successfully', data: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all Surveys
// @route   GET /api/surveys
// @access  Private
const getAllSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find().sort({ createdAt: -1 });
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Survey by ID
// @route   GET /api/surveys/:id
// @access  Private
const getSurveyById = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ message: 'Survey not found' });
    res.json(survey);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Survey
// @route   PUT /api/surveys/:id
// @access  Private (Admin)
const updateSurvey = async (req, res) => {
  try {
    const survey = await Survey.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!survey) return res.status(404).json({ message: 'Survey not found' });
    res.json({ message: 'Survey updated successfully', data: survey });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete Survey
// @route   DELETE /api/surveys/:id
// @access  Private (Admin)
const deleteSurvey = async (req, res) => {
  try {
    const survey = await Survey.findByIdAndDelete(req.params.id);
    if (!survey) return res.status(404).json({ message: 'Survey not found' });
    res.json({ message: 'Survey deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSurvey,
  getAllSurveys,
  getSurveyById,
  updateSurvey,
  deleteSurvey
};
