const UserPermission = require('../models/userPermissionModel');
const Staff = require('../models/staffModel');
const SchoolGlobalDetails = require('../models/schoolGlobalDetailsModel');

// @desc    Get options for user permission dropdowns
// @route   GET /api/user-permissions/options
// @access  Private
const getDropdownOptions = async (req, res) => {
  try {
    const users = await Staff.find({ isActive: true }).select('userName firstName lastName');
    const schools = await SchoolGlobalDetails.find({}).select('schoolName');

    res.status(200).json({
      users,
      schools
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get permissions for a specific user
// @route   GET /api/user-permissions/:userId
// @access  Private
const getUserPermission = async (req, res) => {
  try {
    const { userId } = req.params;

    const permission = await UserPermission.findOne({ user: userId })
      .populate('user', 'userName firstName lastName')
      .populate('schools', 'schoolName');

    if (!permission) {
      return res.status(200).json({
        user: userId,
        schools: [] // Default empty array if no permission is set
      });
    }

    res.status(200).json(permission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update user permission
// @route   POST /api/user-permissions/:userId
// @access  Private
const updateUserPermission = async (req, res) => {
  try {
    const { userId } = req.params;
    const { schools } = req.body;

    if (!schools || !Array.isArray(schools)) {
      return res.status(400).json({ message: 'Schools array is required' });
    }

    const updatedPermission = await UserPermission.findOneAndUpdate(
      { user: userId },
      { $set: { schools } },
      { new: true, runValidators: true, upsert: true }
    )
    .populate('user', 'userName firstName lastName')
    .populate('schools', 'schoolName');

    res.status(200).json(updatedPermission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDropdownOptions,
  getUserPermission,
  updateUserPermission
};
