const SchoolBoard = require('../models/schoolBoardModel');

// @desc    Create a new school board
// @route   POST /api/school-boards
// @access  Private
const createSchoolBoard = async (req, res) => {
  try {
    const { boardName, isDefault } = req.body;

    if (!boardName) {
      return res.status(400).json({ message: 'Board name is required' });
    }

    const boardExists = await SchoolBoard.findOne({ boardName: boardName.toUpperCase() });

    if (boardExists) {
      return res.status(400).json({ message: 'Board already exists' });
    }

    // If this is set as default, unset default for others
    if (isDefault) {
      await SchoolBoard.updateMany({}, { isDefault: false });
    }

    const schoolBoard = await SchoolBoard.create({
      boardName: boardName.toUpperCase(),
      isDefault: isDefault || false
    });

    res.status(201).json(schoolBoard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all school boards
// @route   GET /api/school-boards
// @access  Private
const getSchoolBoards = async (req, res) => {
  try {
    const boards = await SchoolBoard.find({}).sort({ createdAt: -1 });
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get school board by ID
// @route   GET /api/school-boards/:id
// @access  Private
const getSchoolBoardById = async (req, res) => {
  try {
    const board = await SchoolBoard.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res.status(200).json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a school board
// @route   PUT /api/school-boards/:id
// @access  Private
const updateSchoolBoard = async (req, res) => {
  try {
    const { boardName, isDefault, isActive } = req.body;
    const schoolBoard = await SchoolBoard.findById(req.params.id);

    if (!schoolBoard) {
      return res.status(404).json({ message: 'Board not found' });
    }

    if (boardName && boardName.toUpperCase() !== schoolBoard.boardName) {
      const boardExists = await SchoolBoard.findOne({ boardName: boardName.toUpperCase() });
      if (boardExists) {
        return res.status(400).json({ message: 'Board name already in use' });
      }
    }

    // If updating to default, unset default for others
    if (isDefault === true && !schoolBoard.isDefault) {
      await SchoolBoard.updateMany({ _id: { $ne: req.params.id } }, { isDefault: false });
    }

    if (boardName) schoolBoard.boardName = boardName.toUpperCase();
    if (isDefault !== undefined) schoolBoard.isDefault = isDefault;
    if (isActive !== undefined) schoolBoard.isActive = isActive;

    const updatedBoard = await schoolBoard.save();
    res.status(200).json(updatedBoard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a school board
// @route   DELETE /api/school-boards/:id
// @access  Private
const deleteSchoolBoard = async (req, res) => {
  try {
    const schoolBoard = await SchoolBoard.findById(req.params.id);

    if (!schoolBoard) {
      return res.status(404).json({ message: 'Board not found' });
    }

    await schoolBoard.deleteOne();
    res.status(200).json({ message: 'Board removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSchoolBoard,
  getSchoolBoards,
  getSchoolBoardById,
  updateSchoolBoard,
  deleteSchoolBoard
};
