const express = require('express');
const router = express.Router();
const {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment
} = require('../controllers/assignmentController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadSingle } = require('../middlewares/uploadMiddleware');

router.use(protect);

router.route('/')
  .post(uploadSingle.single('attachment'), createAssignment)
  .get(getAllAssignments);

router.route('/:id')
  .get(getAssignmentById)
  .put(uploadSingle.single('attachment'), updateAssignment)
  .delete(deleteAssignment);

module.exports = router;
