const Committee = require('../models/committeeModel');

// @desc    Create a new committee member
// @route   POST /api/committees
// @access  Private
const createCommittee = async (req, res) => {
  try {
    const { committeeType, designation, memberType, memberName, fromDate, toDate, isActive } = req.body;

    if (!committeeType || !designation || !memberName || !fromDate || !toDate) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const committee = await Committee.create({
      committeeType,
      designation,
      memberType,
      memberName,
      fromDate,
      toDate,
      isActive: isActive || false
    });

    res.status(201).json(committee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all committee members
// @route   GET /api/committees
// @access  Private
const getCommittees = async (req, res) => {
  try {
    const committees = await Committee.find({}).sort({ createdAt: -1 });
    res.status(200).json(committees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get committee member by ID
// @route   GET /api/committees/:id
// @access  Private
const getCommitteeById = async (req, res) => {
  try {
    const committee = await Committee.findById(req.params.id);
    if (!committee) {
      return res.status(404).json({ message: 'Committee record not found' });
    }
    res.status(200).json(committee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a committee member
// @route   PUT /api/committees/:id
// @access  Private
const updateCommittee = async (req, res) => {
  try {
    const { committeeType, designation, memberType, memberName, fromDate, toDate, isActive } = req.body;
    const committee = await Committee.findById(req.params.id);

    if (!committee) {
      return res.status(404).json({ message: 'Committee record not found' });
    }

    if (committeeType) committee.committeeType = committeeType;
    if (designation) committee.designation = designation;
    if (memberType) committee.memberType = memberType;
    if (memberName) committee.memberName = memberName;
    if (fromDate) committee.fromDate = fromDate;
    if (toDate) committee.toDate = toDate;
    if (isActive !== undefined) committee.isActive = isActive;

    const updatedCommittee = await committee.save();
    res.status(200).json(updatedCommittee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a committee member
// @route   DELETE /api/committees/:id
// @access  Private
const deleteCommittee = async (req, res) => {
  try {
    const committee = await Committee.findById(req.params.id);

    if (!committee) {
      return res.status(404).json({ message: 'Committee record not found' });
    }

    await committee.deleteOne();
    res.status(200).json({ message: 'Committee record removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCommittee,
  getCommittees,
  getCommitteeById,
  updateCommittee,
  deleteCommittee
};
