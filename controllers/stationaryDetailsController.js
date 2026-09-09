const StationaryDetails = require('../models/stationaryDetailsModel');

// @desc    Create new stationary details
// @route   POST /api/stationary-details
// @access  Private
const createStationaryDetails = async (req, res) => {
  try {
    const { stationaryName, amount, postAccountName, school, session } = req.body;

    if (!stationaryName || amount === undefined || !postAccountName || !school || !session) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const stationary = await StationaryDetails.create({
      stationaryName,
      amount,
      postAccountName,
      school,
      session
    });

    res.status(201).json(stationary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all stationary details
// @route   GET /api/stationary-details
// @access  Private
const getStationaryDetails = async (req, res) => {
  try {
    const filter = {};
    if (req.query.school) filter.school = req.query.school;
    if (req.query.session) filter.session = req.query.session;

    const stationaries = await StationaryDetails.find(filter)
      .populate('school', 'schoolName')
      .populate('session', 'name')
      .sort({ createdAt: -1 });
      
    res.status(200).json(stationaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get stationary details by ID
// @route   GET /api/stationary-details/:id
// @access  Private
const getStationaryDetailsById = async (req, res) => {
  try {
    const stationary = await StationaryDetails.findById(req.params.id)
      .populate('school', 'schoolName')
      .populate('session', 'name');
      
    if (!stationary) {
      return res.status(404).json({ message: 'Stationary Details not found' });
    }
    res.status(200).json(stationary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update stationary details
// @route   PUT /api/stationary-details/:id
// @access  Private
const updateStationaryDetails = async (req, res) => {
  try {
    const { stationaryName, amount, postAccountName, school, session } = req.body;
    const stationary = await StationaryDetails.findById(req.params.id);

    if (!stationary) {
      return res.status(404).json({ message: 'Stationary Details not found' });
    }

    if (stationaryName) stationary.stationaryName = stationaryName;
    if (amount !== undefined) stationary.amount = amount;
    if (postAccountName) stationary.postAccountName = postAccountName;
    if (school) stationary.school = school;
    if (session) stationary.session = session;

    const updatedStationary = await stationary.save();
    res.status(200).json(updatedStationary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete stationary details
// @route   DELETE /api/stationary-details/:id
// @access  Private
const deleteStationaryDetails = async (req, res) => {
  try {
    const stationary = await StationaryDetails.findById(req.params.id);

    if (!stationary) {
      return res.status(404).json({ message: 'Stationary Details not found' });
    }

    await stationary.deleteOne();
    res.status(200).json({ message: 'Stationary Details removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStationaryDetails,
  getStationaryDetails,
  getStationaryDetailsById,
  updateStationaryDetails,
  deleteStationaryDetails
};
