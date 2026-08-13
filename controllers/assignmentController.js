const Assignment = require('../models/assignmentModel');

const getFileUrl = (req, fieldName) => {
  if (req.file && req.file.fieldname === fieldName) {
    return `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }
  return '';
};

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Private (Admin)
const createAssignment = async (req, res) => {
  try {
    let data = req.body;
    if (req.body.data) {
       data = JSON.parse(req.body.data); // in case of multipart/form-data with a JSON field
    }

    const assignment = new Assignment({
      ...data,
      createdBy: req.user?._id
    });

    if (req.file) {
      assignment.attachment = getFileUrl(req, 'attachment');
    }

    const saved = await assignment.save();
    res.status(201).json({ message: 'Assignment created successfully', assignment: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private (Admin)
const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get assignment by ID
// @route   GET /api/assignments/:id
// @access  Private (Admin)
const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an assignment
// @route   PUT /api/assignments/:id
// @access  Private (Admin)
const updateAssignment = async (req, res) => {
  try {
    let data = req.body;
    if (req.body.data) {
       data = JSON.parse(req.body.data);
    }

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    // Update fields
    Object.keys(data).forEach(key => {
      assignment[key] = data[key];
    });

    if (req.file) {
      assignment.attachment = getFileUrl(req, 'attachment');
    }

    const updated = await assignment.save();
    res.json({ message: 'Assignment updated successfully', assignment: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an assignment
// @route   DELETE /api/assignments/:id
// @access  Private (Admin)
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment
};
