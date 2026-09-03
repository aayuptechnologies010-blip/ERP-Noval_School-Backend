const Admin = require('../models/adminModel');
const Staff = require('../models/staffModel');

// @desc    Get user favorite pages
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    let user = await Staff.findById(req.user._id);
    if (!user) {
      user = await Admin.findById(req.user._id);
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.favoritePages || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user favorite pages
// @route   PUT /api/favorites
// @access  Private
const updateFavorites = async (req, res) => {
  try {
    const { favorites } = req.body;
    
    let user = await Staff.findById(req.user._id);
    if (!user) {
      user = await Admin.findById(req.user._id);
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.favoritePages = favorites || [];
    await user.save();

    res.status(200).json(user.favoritePages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFavorites,
  updateFavorites
};
