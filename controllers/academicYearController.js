const AcademicYear = require('../models/academicYearModel');

// @desc    Create a new academic year
// @route   POST /api/academic-years
// @access  Private (Admin/Admission Manager)
const createAcademicYear = async (req, res) => {
  try {
    const { name, startDate, endDate, isActive } = req.body;

    if (!name || !startDate || !endDate) {
      return res.status(400).json({ message: 'Name, start date, and end date are required' });
    }

    const yearExists = await AcademicYear.findOne({ name });
    if (yearExists) {
      return res.status(400).json({ message: 'Academic Year already exists' });
    }

    // If this one is set to active, deactivate all others
    if (isActive) {
      await AcademicYear.updateMany({}, { isActive: false });
    }

    const academicYear = await AcademicYear.create({
      name,
      startDate,
      endDate,
      isActive: isActive || false
    });

    res.status(201).json(academicYear);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all academic years
// @route   GET /api/academic-years
// @access  Private
const getAcademicYears = async (req, res) => {
  try {
    const academicYears = await AcademicYear.find({}).sort({ startDate: -1 });
    res.status(200).json(academicYears);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an academic year
// @route   PUT /api/academic-years/:id
// @access  Private
const updateAcademicYear = async (req, res) => {
  try {
    const { name, startDate, endDate, isActive } = req.body;

    const academicYear = await AcademicYear.findById(req.params.id);

    if (!academicYear) {
      return res.status(404).json({ message: 'Academic Year not found' });
    }

    // Check if updating name and it already exists
    if (name && name !== academicYear.name) {
      const yearExists = await AcademicYear.findOne({ name });
      if (yearExists) {
        return res.status(400).json({ message: 'Academic Year name already in use' });
      }
    }

    // If changing to active, deactivate all others
    if (isActive && !academicYear.isActive) {
      await AcademicYear.updateMany({ _id: { $ne: academicYear._id } }, { isActive: false });
    }

    if (name) academicYear.name = name;
    if (startDate) academicYear.startDate = startDate;
    if (endDate) academicYear.endDate = endDate;
    if (isActive !== undefined) academicYear.isActive = isActive;

    const updatedAcademicYear = await academicYear.save();
    res.status(200).json(updatedAcademicYear);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an academic year
// @route   DELETE /api/academic-years/:id
// @access  Private
const deleteAcademicYear = async (req, res) => {
  try {
    const academicYear = await AcademicYear.findById(req.params.id);

    if (!academicYear) {
      return res.status(404).json({ message: 'Academic Year not found' });
    }

    // Prevent deletion of active academic year to avoid breaking the system
    if (academicYear.isActive) {
      return res.status(400).json({ message: 'Cannot delete an active academic year. Please activate another year first.' });
    }

    await academicYear.deleteOne();
    res.status(200).json({ message: 'Academic Year removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAcademicYear,
  getAcademicYears,
  updateAcademicYear,
  deleteAcademicYear
};
