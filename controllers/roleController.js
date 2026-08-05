const Role = require('../models/roleModel');

// @desc    Create a new role
// @route   POST /api/roles
// @access  Private (Admin only)
const createRole = async (req, res) => {
  try {
    const { roleName, description, isActive } = req.body;

    if (!roleName) {
      return res.status(400).json({ message: 'Role name is required' });
    }

    const roleExists = await Role.findOne({ roleName });

    if (roleExists) {
      return res.status(400).json({ message: 'Role already exists' });
    }

    const role = await Role.create({
      roleName,
      description,
      isActive
    });

    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private (Admin only)
const getRoles = async (req, res) => {
  try {
    const roles = await Role.find({});
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single role by ID
// @route   GET /api/roles/:id
// @access  Private (Admin only)
const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (role) {
      res.json(role);
    } else {
      res.status(404).json({ message: 'Role not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a role
// @route   PUT /api/roles/:id
// @access  Private (Admin only)
const updateRole = async (req, res) => {
  try {
    const { roleName, description } = req.body;
    
    const role = await Role.findById(req.params.id);

    if (role) {
      // Check if new roleName already exists in another document
      if (roleName && roleName !== role.roleName) {
        const roleExists = await Role.findOne({ roleName });
        if (roleExists) {
          return res.status(400).json({ message: 'Another role with this name already exists' });
        }
      }

      role.roleName = roleName || role.roleName;
      role.description = description !== undefined ? description : role.description;

      const updatedRole = await role.save();
      res.json(updatedRole);
    } else {
      res.status(404).json({ message: 'Role not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle Role Status (Active/Inactive)
// @route   PATCH /api/roles/:id/status
// @access  Private (Admin only)
const toggleRoleStatus = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (role) {
      role.isActive = !role.isActive;
      const updatedRole = await role.save();
      res.json(updatedRole);
    } else {
      res.status(404).json({ message: 'Role not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a role
// @route   DELETE /api/roles/:id
// @access  Private (Admin only)
const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);

    if (role) {
      res.json({ message: 'Role removed completely' });
    } else {
      res.status(404).json({ message: 'Role not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  toggleRoleStatus,
  deleteRole
};
