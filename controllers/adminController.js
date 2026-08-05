const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/adminModel');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

// @desc    Register a new admin
// @route   POST /api/admin/register
// @access  Public
const registerAdmin = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    // Check if admin exists
    const adminExists = await Admin.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin with this email or username already exists' });
    }

    // Create admin
    const admin = await Admin.create({
      firstName,
      lastName,
      username,
      email,
      password,
    });

    if (admin) {
      res.status(201).json({
        _id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        username: admin.username,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate an admin
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check for user username
    const admin = await Admin.findOne({ username }).select('+password');

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        username: admin.username,
        email: admin.email,
        profileImage: admin.profileImage,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (admin) {
      res.json(admin);
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private
const updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);

    if (admin) {
      admin.firstName = req.body.firstName || admin.firstName;
      admin.lastName = req.body.lastName || admin.lastName;
      admin.email = req.body.email || admin.email;
      admin.phone = req.body.phone || admin.phone;
      admin.gender = req.body.gender || admin.gender;
      admin.dob = req.body.dob || admin.dob;
      admin.address = req.body.address || admin.address;
      admin.qualification = req.body.qualification || admin.qualification;
      admin.experience = req.body.experience || admin.experience;
      admin.joiningDate = req.body.joiningDate || admin.joiningDate;

      // Handle Image upload
      if (req.file) {
        // Construct the URL to access the image
        // Assuming we serve /uploads statically on the root
        const protocol = req.protocol;
        const host = req.get('host');
        admin.profileImage = `${protocol}://${host}/uploads/${req.file.filename}`;
      }

      const updatedAdmin = await admin.save();

      res.json({
        _id: updatedAdmin.id,
        firstName: updatedAdmin.firstName,
        lastName: updatedAdmin.lastName,
        username: updatedAdmin.username,
        email: updatedAdmin.email,
        phone: updatedAdmin.phone,
        gender: updatedAdmin.gender,
        dob: updatedAdmin.dob,
        address: updatedAdmin.address,
        qualification: updatedAdmin.qualification,
        experience: updatedAdmin.experience,
        joiningDate: updatedAdmin.joiningDate,
        profileImage: updatedAdmin.profileImage,
      });
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change Password
// @route   PUT /api/admin/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide both old and new passwords' });
    }

    const admin = await Admin.findById(req.user.id).select('+password');

    if (admin && (await admin.matchPassword(oldPassword))) {
      admin.password = newPassword;
      await admin.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Invalid old password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  changePassword,
};
