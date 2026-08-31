const House = require('../models/houseModel');

// @desc    Create a new house
// @route   POST /api/houses
// @access  Private
const createHouse = async (req, res) => {
  try {
    const { houseName } = req.body;

    if (!houseName) {
      return res.status(400).json({ message: 'House name is required' });
    }

    const houseExists = await House.findOne({ houseName: houseName.toUpperCase() });

    if (houseExists) {
      return res.status(400).json({ message: 'House already exists' });
    }

    const house = await House.create({
      houseName: houseName.toUpperCase()
    });

    res.status(201).json(house);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all houses
// @route   GET /api/houses
// @access  Private
const getHouses = async (req, res) => {
  try {
    const houses = await House.find({}).sort({ createdAt: -1 });
    res.status(200).json(houses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get house by ID
// @route   GET /api/houses/:id
// @access  Private
const getHouseById = async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house) {
      return res.status(404).json({ message: 'House not found' });
    }
    res.status(200).json(house);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a house
// @route   PUT /api/houses/:id
// @access  Private
const updateHouse = async (req, res) => {
  try {
    const { houseName, isActive } = req.body;
    const house = await House.findById(req.params.id);

    if (!house) {
      return res.status(404).json({ message: 'House not found' });
    }

    if (houseName && houseName.toUpperCase() !== house.houseName) {
      const houseExists = await House.findOne({ houseName: houseName.toUpperCase() });
      if (houseExists) {
        return res.status(400).json({ message: 'House name already in use' });
      }
    }

    if (houseName) house.houseName = houseName.toUpperCase();
    if (isActive !== undefined) house.isActive = isActive;

    const updatedHouse = await house.save();
    res.status(200).json(updatedHouse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a house
// @route   DELETE /api/houses/:id
// @access  Private
const deleteHouse = async (req, res) => {
  try {
    const house = await House.findById(req.params.id);

    if (!house) {
      return res.status(404).json({ message: 'House not found' });
    }

    await house.deleteOne();
    res.status(200).json({ message: 'House removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createHouse,
  getHouses,
  getHouseById,
  updateHouse,
  deleteHouse
};
