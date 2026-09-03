const Character = require('../models/characterModel');

// @desc    Create a new character
// @route   POST /api/characters
// @access  Private
const createCharacter = async (req, res) => {
  try {
    const { characterName } = req.body;

    if (!characterName) {
      return res.status(400).json({ message: 'Character name is required' });
    }

    const exists = await Character.findOne({ characterName: { $regex: new RegExp(`^${characterName}$`, 'i') } });

    if (exists) {
      return res.status(400).json({ message: 'Character already exists' });
    }

    const character = await Character.create({
      characterName
    });

    res.status(201).json(character);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all characters
// @route   GET /api/characters
// @access  Private
const getCharacters = async (req, res) => {
  try {
    const characters = await Character.find({}).sort({ createdAt: -1 });
    res.status(200).json(characters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get character by ID
// @route   GET /api/characters/:id
// @access  Private
const getCharacterById = async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
    res.status(200).json(character);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a character
// @route   PUT /api/characters/:id
// @access  Private
const updateCharacter = async (req, res) => {
  try {
    const { characterName, isActive } = req.body;
    const character = await Character.findById(req.params.id);

    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    if (characterName && characterName.toLowerCase() !== character.characterName.toLowerCase()) {
      const exists = await Character.findOne({ characterName: { $regex: new RegExp(`^${characterName}$`, 'i') } });
      if (exists) {
        return res.status(400).json({ message: 'Character name already in use' });
      }
    }

    if (characterName) character.characterName = characterName;
    if (isActive !== undefined) character.isActive = isActive;

    const updatedCharacter = await character.save();
    res.status(200).json(updatedCharacter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a character
// @route   DELETE /api/characters/:id
// @access  Private
const deleteCharacter = async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);

    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    await character.deleteOne();
    res.status(200).json({ message: 'Character removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCharacter,
  getCharacters,
  getCharacterById,
  updateCharacter,
  deleteCharacter
};
