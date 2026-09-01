const express = require('express');
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getFavoriteStudents,
  toggleStudentFavorite,
  bulkUpdateRollNumbers,
  bulkUpdateHouseNames,
  bulkUpdatePhotos,
  bulkUpdateClubs,
  uploadStudentDocument,
  verifyStudentDocument,
  allotClassAndSection,
  generateTC,
  importStudents
} = require('../controllers/studentController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadMultiple, uploadAny, uploadDocument, uploadSingle } = require('../middlewares/uploadMiddleware');

// Protect all routes
router.use(protect);

router.route('/')
  .post(uploadMultiple, createStudent)
  .get(getAllStudents);

// Import students
router.post('/import', uploadSingle.single('file'), importStudents);

// Get favorite students (must be before /:id)
router.get('/favorites', getFavoriteStudents);

// Bulk update roll numbers (must be before /:id)
router.put('/bulk/roll-numbers', bulkUpdateRollNumbers);

// Bulk update house names (must be before /:id)
router.put('/bulk/house-names', bulkUpdateHouseNames);

// Bulk update photos (must be before /:id)
router.put('/bulk/photos', uploadAny, bulkUpdatePhotos);

// Bulk update clubs (must be before /:id)
router.put('/bulk/clubs', bulkUpdateClubs);

router.route('/:id')
  .get(getStudentById)
  .put(uploadMultiple, updateStudent)
  .delete(deleteStudent);

router.route('/:id/favorite')
  .patch(toggleStudentFavorite);

// Post-Admission workflows
router.post('/:id/documents', uploadDocument.array('documents', 10), uploadStudentDocument);
router.patch('/:id/documents/:docId/verify', verifyStudentDocument);
router.patch('/:id/allotment', allotClassAndSection);
router.patch('/:id/generate-tc', generateTC);

module.exports = router;
