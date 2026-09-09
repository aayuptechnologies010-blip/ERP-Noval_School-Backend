const CPCLevel = require('../models/cpcLevelModel');

// @desc    Get all 7th CPC Levels
// @route   GET /api/cpc-levels
// @access  Private (Admin)
const getAll = async (req, res) => {
  try {
    const levels = await CPCLevel.find().sort({ orderNo: 1 });
    res.json(levels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get 7th CPC Level by ID
// @route   GET /api/cpc-levels/:id
// @access  Private (Admin)
const getById = async (req, res) => {
  try {
    const level = await CPCLevel.findById(req.params.id);
    if (!level) {
      return res.status(404).json({ message: 'CPC Level not found' });
    }
    res.json(level);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create 7th CPC Level
// @route   POST /api/cpc-levels
// @access  Private (Admin)
const create = async (req, res) => {
  try {
    const { cpcLevel, orderNo, noOfCells, amount, cells, isActive } = req.body;
    if (!cpcLevel || !orderNo) {
      return res.status(400).json({ message: 'CPC Level and Order No are required' });
    }

    const cellCount = Number(noOfCells) || 40;
    const baseAmt = Number(amount) || 18000;

    // Generate default cells if not supplied
    let cellList = cells;
    if (!cellList || cellList.length === 0) {
      cellList = [];
      for (let i = 1; i <= cellCount; i++) {
        // ~3% increment per cell standard CPC logic
        const cellAmt = Math.round(baseAmt * Math.pow(1.03, i - 1) / 100) * 100;
        cellList.push({ cellIndex: i, amount: cellAmt });
      }
    }

    const newLevel = await CPCLevel.create({
      cpcLevel,
      orderNo: Number(orderNo),
      noOfCells: cellCount,
      amount: baseAmt,
      cells: cellList,
      isActive: isActive !== undefined ? !!isActive : true
    });

    res.status(201).json(newLevel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update 7th CPC Level
// @route   PUT /api/cpc-levels/:id
// @access  Private (Admin)
const update = async (req, res) => {
  try {
    const level = await CPCLevel.findById(req.params.id);
    if (!level) {
      return res.status(404).json({ message: 'CPC Level not found' });
    }

    const { cpcLevel, orderNo, noOfCells, amount, cells, isActive } = req.body;
    if (cpcLevel !== undefined) level.cpcLevel = cpcLevel;
    if (orderNo !== undefined) level.orderNo = Number(orderNo);
    if (noOfCells !== undefined) level.noOfCells = Number(noOfCells);
    if (amount !== undefined) level.amount = Number(amount);
    if (cells !== undefined) level.cells = cells;
    if (isActive !== undefined) level.isActive = !!isActive;

    const updated = await level.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save/Update matrix cells for a CPC level
// @route   PUT /api/cpc-levels/:id/cells
// @access  Private (Admin)
const saveCells = async (req, res) => {
  try {
    const level = await CPCLevel.findById(req.params.id);
    if (!level) {
      return res.status(404).json({ message: 'CPC Level not found' });
    }

    const { cells } = req.body;
    if (!cells || !Array.isArray(cells)) {
      return res.status(400).json({ message: 'cells array is required' });
    }

    level.cells = cells;
    const updated = await level.save();
    res.json({ message: 'Cells saved successfully', level: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete 7th CPC Level
// @route   DELETE /api/cpc-levels/:id
// @access  Private (Admin)
const remove = async (req, res) => {
  try {
    const level = await CPCLevel.findById(req.params.id);
    if (!level) {
      return res.status(404).json({ message: 'CPC Level not found' });
    }

    await level.deleteOne();
    res.json({ message: 'CPC Level deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  saveCells,
  remove
};
