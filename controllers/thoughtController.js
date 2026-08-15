const Thought = require('../models/thoughtModel');

// @desc    Create a new thought
// @route   POST /api/thoughts
// @access  Private
const createThought = async (req, res) => {
  try {
    const { thought, author, date } = req.body;

    if (!thought || !author || !date) {
      return res.status(400).json({ message: 'Please provide thought, author and date' });
    }

    const newThought = await Thought.create({
      thought,
      author,
      date,
      createdBy: req.user ? req.user._id : undefined
    });

    res.status(201).json(newThought);
  } catch (error) {
    res.status(500).json({ message: 'Error creating thought', error: error.message });
  }
};

// @desc    Get all thoughts
// @route   GET /api/thoughts
// @access  Private
const getThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find({}).sort({ date: -1 });
    res.status(200).json(thoughts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching thoughts', error: error.message });
  }
};

// @desc    Get a single thought by ID
// @route   GET /api/thoughts/:id
// @access  Private
const getThoughtById = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.status(200).json(thought);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching thought', error: error.message });
  }
};

// @desc    Update a thought
// @route   PUT /api/thoughts/:id
// @access  Private
const updateThought = async (req, res) => {
  try {
    const { thought, author, date } = req.body;
    
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.id,
      { thought, author, date },
      { new: true, runValidators: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    
    res.status(200).json(updatedThought);
  } catch (error) {
    res.status(500).json({ message: 'Error updating thought', error: error.message });
  }
};

// @desc    Delete a thought
// @route   DELETE /api/thoughts/:id
// @access  Private
const deleteThought = async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.id);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.status(200).json({ message: 'Thought deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting thought', error: error.message });
  }
};

module.exports = {
  createThought,
  getThoughts,
  getThoughtById,
  updateThought,
  deleteThought
};
