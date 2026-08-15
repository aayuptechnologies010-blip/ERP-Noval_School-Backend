const Reward = require('../models/rewardModel');

// @desc    Create a new reward definition
// @route   POST /api/rewards
// @access  Private
const createReward = async (req, res) => {
  try {
    const { title, category, value, description } = req.body;

    if (!title || !category || value === undefined || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const reward = await Reward.create({
      title,
      category,
      value,
      description,
      createdBy: req.user ? req.user._id : undefined
    });

    res.status(201).json(reward);
  } catch (error) {
    res.status(500).json({ message: 'Error creating reward', error: error.message });
  }
};

// @desc    Get all reward definitions
// @route   GET /api/rewards
// @access  Private
const getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find().sort({ createdAt: -1 });
    res.status(200).json(rewards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rewards', error: error.message });
  }
};

// @desc    Get a single reward definition by ID
// @route   GET /api/rewards/:id
// @access  Private
const getRewardById = async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }
    res.status(200).json(reward);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reward', error: error.message });
  }
};

// @desc    Update a reward definition
// @route   PUT /api/rewards/:id
// @access  Private
const updateReward = async (req, res) => {
  try {
    const { title, category, value, description } = req.body;
    
    const reward = await Reward.findByIdAndUpdate(
      req.params.id,
      { title, category, value, description },
      { new: true, runValidators: true }
    );

    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }
    
    res.status(200).json(reward);
  } catch (error) {
    res.status(500).json({ message: 'Error updating reward', error: error.message });
  }
};

// @desc    Delete a reward definition
// @route   DELETE /api/rewards/:id
// @access  Private
const deleteReward = async (req, res) => {
  try {
    const reward = await Reward.findByIdAndDelete(req.params.id);
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }
    res.status(200).json({ message: 'Reward deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting reward', error: error.message });
  }
};

module.exports = {
  createReward,
  getRewards,
  getRewardById,
  updateReward,
  deleteReward
};
