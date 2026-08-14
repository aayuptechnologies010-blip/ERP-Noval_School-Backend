const Questionnaire = require('../models/questionnaireModel');

// @desc    Create a new Questionnaire
// @route   POST /api/questionnaires
// @access  Private
const createQuestionnaire = async (req, res) => {
  try {
    const { title, targetAudience, status } = req.body;

    if (!title || !targetAudience || !status) {
      return res.status(400).json({
        message: 'title, targetAudience, and status are required.',
      });
    }

    const questionnaire = new Questionnaire({
      title,
      targetAudience,
      status,
    });

    const savedQuestionnaire = await questionnaire.save();
    res.status(201).json({ message: 'Questionnaire created successfully', questionnaire: savedQuestionnaire });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all Questionnaires
// @route   GET /api/questionnaires
// @access  Private
const getAllQuestionnaires = async (req, res) => {
  try {
    const questionnaires = await Questionnaire.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: questionnaires.length,
      records: questionnaires,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a Questionnaire
// @route   PUT /api/questionnaires/:id
// @access  Private
const updateQuestionnaire = async (req, res) => {
  try {
    const { title, targetAudience, status } = req.body;

    const questionnaire = await Questionnaire.findById(req.params.id);

    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }

    if (title) questionnaire.title = title;
    if (targetAudience) questionnaire.targetAudience = targetAudience;
    if (status) questionnaire.status = status;

    const updatedQuestionnaire = await questionnaire.save();

    res.json({ message: 'Questionnaire updated successfully', questionnaire: updatedQuestionnaire });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a Questionnaire
// @route   DELETE /api/questionnaires/:id
// @access  Private
const deleteQuestionnaire = async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findByIdAndDelete(req.params.id);

    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }

    res.json({ message: 'Questionnaire deleted successfully', questionnaire });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Questionnaire by ID
// @route   GET /api/questionnaires/:id
// @access  Private
const getQuestionnaireById = async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findById(req.params.id);

    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }

    res.json(questionnaire);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createQuestionnaire,
  getAllQuestionnaires,
  updateQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaireById
};
