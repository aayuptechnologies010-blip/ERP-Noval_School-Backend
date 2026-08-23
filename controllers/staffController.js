const Staff = require('../models/staffModel');

// Helper to flatten nested objects for partial updates in Mongoose
const flattenObject = (ob) => {
  let toReturn = {};
  for (let i in ob) {
    if (!ob.hasOwnProperty(i)) continue;
    // Don't flatten arrays or nulls or Date objects
    if ((typeof ob[i]) === 'object' && ob[i] !== null && !Array.isArray(ob[i]) && !(ob[i] instanceof Date)) {
      let flatObject = flattenObject(ob[i]);
      for (let x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        toReturn[i + '.' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
};

// Helper to get uploaded file URL
const getFileUrl = (req, fieldName) => {
  if (req.file && req.file.fieldname === fieldName) {
    return `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }
  return '';
};

// @desc    Create a new staff member
// @route   POST /api/staff
// @access  Private (Admin)
const createStaff = async (req, res) => {
  try {
    let staffData = req.body;
    if (req.body.data) {
      staffData = JSON.parse(req.body.data);
    }

    // Check if user name (employee ID) already exists
    const existingStaff = await Staff.findOne({ userName: staffData.userName });
    if (existingStaff) {
      return res.status(400).json({ message: 'Staff with this User Name (ID) already exists' });
    }

    // Set a default password if not provided
    if (!staffData.password) {
      staffData.password = staffData.userName + '@123'; // Default password
    }

    const staff = new Staff(staffData);

    // Attach profile photo if uploaded
    if (req.file) {
      staff.staffPhoto = getFileUrl(req, 'staffPhoto');
    }

    const savedStaff = await staff.save();
    // Populate role before sending response
    await savedStaff.populate('role', 'roleName');
    
    res.status(201).json(savedStaff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all staff members
// @route   GET /api/staff
// @access  Private (Admin)
const getAllStaff = async (req, res) => {
  try {
    const staffMembers = await Staff.find().populate('role', 'roleName description');
    res.json(staffMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get staff member by ID
// @route   GET /api/staff/:id
// @access  Private (Admin)
const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).populate('role', 'roleName description');
    if (staff) {
      res.json(staff);
    } else {
      res.status(404).json({ message: 'Staff member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a staff member
// @route   PUT /api/staff/:id
// @access  Private (Admin)
const updateStaff = async (req, res) => {
  try {
    let staffData = req.body;
    if (req.body.data) {
      staffData = JSON.parse(req.body.data);
    }

    const staff = await Staff.findById(req.params.id);

    if (staff) {
      // Flatten the incoming data for partial update
      const flatData = flattenObject(staffData);
      staff.set(flatData);

      // Update photo if a new one is uploaded
      if (req.file) {
        staff.staffPhoto = getFileUrl(req, 'staffPhoto');
      }

      const updatedStaff = await staff.save();
      await updatedStaff.populate('role', 'roleName');
      
      res.json(updatedStaff);
    } else {
      res.status(404).json({ message: 'Staff member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a staff member
// @route   DELETE /api/staff/:id
// @access  Private (Admin)
const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (staff) {
      await staff.deleteOne();
      res.json({ message: 'Staff member removed successfully' });
    } else {
      res.status(404).json({ message: 'Staff member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle a staff member's active status
// @route   PATCH /api/staffs/:id/status
// @access  Private (Admin)
const toggleStaffStatus = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (staff) {
      staff.isActive = !staff.isActive;
      const updatedStaff = await staff.save();
      res.json({ message: `Staff member status updated to ${updatedStaff.isActive ? 'Active' : 'Inactive'}`, isActive: updatedStaff.isActive });
    } else {
      res.status(404).json({ message: 'Staff member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all favorite staff members
// @route   GET /api/staffs/favorites
// @access  Private (Admin)
const getFavoriteStaff = async (req, res) => {
  try {
    const staffMembers = await Staff.find({ isFavorite: true }).populate('role', 'roleName description');
    res.json(staffMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle a staff member's favorite status
// @route   PATCH /api/staffs/:id/favorite
// @access  Private (Admin)
const toggleStaffFavorite = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (staff) {
      staff.isFavorite = !staff.isFavorite;
      const updatedStaff = await staff.save();
      res.json({ message: `Staff member marked as ${updatedStaff.isFavorite ? 'Favorite' : 'Not Favorite'}`, isFavorite: updatedStaff.isFavorite });
    } else {
      res.status(404).json({ message: 'Staff member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk assign class teachers
// @route   PUT /api/staffs/bulk/assign-class-teacher
// @access  Private (Admin)
const bulkAssignClassTeacher = async (req, res) => {
  try {
    const { updates } = req.body; // Expecting [{ staffId: '...', assignedClass: '...', assignedSection: '...' }]

    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ message: 'Invalid data format. Expected an array of updates in "updates" field.' });
    }

    const bulkOps = updates.map((update) => ({
      updateOne: {
        filter: { _id: update.staffId },
        update: { 
          $set: { 
            assignedClass: update.assignedClass,
            assignedSection: update.assignedSection
          } 
        }
      }
    }));

    if (bulkOps.length > 0) {
      const result = await Staff.bulkWrite(bulkOps);
      res.json({ message: 'Class teachers assigned successfully', result });
    } else {
      res.json({ message: 'No updates provided' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  toggleStaffStatus,
  getFavoriteStaff,
  toggleStaffFavorite,
  bulkAssignClassTeacher
};
