const express = require('express');
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadMultiple } = require('../middlewares/uploadMiddleware');

// Protect all routes
router.use(protect);

router.route('/')
  .post(uploadMultiple, createStudent)
  .get(getAllStudents);

router.route('/:id')
  .get(getStudentById)
  .put(uploadMultiple, updateStudent)
  .delete(deleteStudent);

module.exports = router;
