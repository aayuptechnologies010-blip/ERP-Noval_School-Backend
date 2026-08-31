const SchoolClass = require('../models/schoolClassModel');

// @desc    Create a new school class
// @route   POST /api/school-classes
// @access  Private
const createSchoolClass = async (req, res) => {
  try {
    const { className, wingName, schoolName, orderNo } = req.body;

    if (!className) {
      return res.status(400).json({ message: 'Class name is required' });
    }

    const classExists = await SchoolClass.findOne({ className: className.toUpperCase() });

    if (classExists) {
      return res.status(400).json({ message: 'Class already exists' });
    }

    const schoolClass = await SchoolClass.create({
      className: className.toUpperCase(),
      wingName,
      schoolName,
      orderNo
    });

    res.status(201).json(schoolClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all school classes
// @route   GET /api/school-classes
// @access  Private
const getSchoolClasses = async (req, res) => {
  try {
    // Sort by orderNo first, then by createdAt
    const classes = await SchoolClass.find({}).sort({ orderNo: 1, createdAt: -1 });
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a school class
// @route   PUT /api/school-classes/:id
// @access  Private
const updateSchoolClass = async (req, res) => {
  try {
    const { className, wingName, schoolName, orderNo, isActive } = req.body;
    const schoolClass = await SchoolClass.findById(req.params.id);

    if (!schoolClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    if (className && className.toUpperCase() !== schoolClass.className) {
      const classExists = await SchoolClass.findOne({ className: className.toUpperCase() });
      if (classExists) {
        return res.status(400).json({ message: 'Class name already in use' });
      }
    }

    if (className) schoolClass.className = className.toUpperCase();
    if (wingName !== undefined) schoolClass.wingName = wingName;
    if (schoolName !== undefined) schoolClass.schoolName = schoolName;
    if (orderNo !== undefined) schoolClass.orderNo = orderNo;
    if (isActive !== undefined) schoolClass.isActive = isActive;

    const updatedClass = await schoolClass.save();
    res.status(200).json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a school class
// @route   DELETE /api/school-classes/:id
// @access  Private
const deleteSchoolClass = async (req, res) => {
  try {
    const schoolClass = await SchoolClass.findById(req.params.id);

    if (!schoolClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    await schoolClass.deleteOne();
    res.status(200).json({ message: 'Class removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSchoolClass,
  getSchoolClasses,
  updateSchoolClass,
  deleteSchoolClass
};
