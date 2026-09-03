const Language = require('../models/languageModel');

// @desc    Create a new language
// @route   POST /api/languages
// @access  Private
const createLanguage = async (req, res) => {
  try {
    const { languageName } = req.body;

    if (!languageName) {
      return res.status(400).json({ message: 'Language name is required' });
    }

    const exists = await Language.findOne({ languageName: { $regex: new RegExp(`^${languageName}$`, 'i') } });

    if (exists) {
      return res.status(400).json({ message: 'Language already exists' });
    }

    const language = await Language.create({
      languageName
    });

    res.status(201).json(language);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all languages
// @route   GET /api/languages
// @access  Private
const getLanguages = async (req, res) => {
  try {
    const languages = await Language.find({}).sort({ createdAt: -1 });
    res.status(200).json(languages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get language by ID
// @route   GET /api/languages/:id
// @access  Private
const getLanguageById = async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);
    if (!language) {
      return res.status(404).json({ message: 'Language not found' });
    }
    res.status(200).json(language);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a language
// @route   PUT /api/languages/:id
// @access  Private
const updateLanguage = async (req, res) => {
  try {
    const { languageName, isActive } = req.body;
    const language = await Language.findById(req.params.id);

    if (!language) {
      return res.status(404).json({ message: 'Language not found' });
    }

    if (languageName && languageName.toLowerCase() !== language.languageName.toLowerCase()) {
      const exists = await Language.findOne({ languageName: { $regex: new RegExp(`^${languageName}$`, 'i') } });
      if (exists) {
        return res.status(400).json({ message: 'Language name already in use' });
      }
    }

    if (languageName) language.languageName = languageName;
    if (isActive !== undefined) language.isActive = isActive;

    const updatedLanguage = await language.save();
    res.status(200).json(updatedLanguage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a language
// @route   DELETE /api/languages/:id
// @access  Private
const deleteLanguage = async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);

    if (!language) {
      return res.status(404).json({ message: 'Language not found' });
    }

    await language.deleteOne();
    res.status(200).json({ message: 'Language removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLanguage,
  getLanguages,
  getLanguageById,
  updateLanguage,
  deleteLanguage
};
