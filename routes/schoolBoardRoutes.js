const express = require('express');
const router = express.Router();
const {
  createSchoolBoard,
  getSchoolBoards,
  getSchoolBoardById,
  updateSchoolBoard,
  deleteSchoolBoard
} = require('../controllers/schoolBoardController');

router.route('/')
  .post(createSchoolBoard)
  .get(getSchoolBoards);

router.route('/:id')
  .get(getSchoolBoardById)
  .put(updateSchoolBoard)
  .delete(deleteSchoolBoard);

module.exports = router;
