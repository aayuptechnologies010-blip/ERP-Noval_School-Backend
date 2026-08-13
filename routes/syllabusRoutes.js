const express = require('express');
const router = express.Router();
const {
  createSyllabus,
  getSyllabi,
  downloadSyllabus,
  deleteSyllabus
} = require('../controllers/syllabusController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadDocument } = require('../middlewares/uploadMiddleware');

router.use(protect);

router.route('/')
  .post(uploadDocument.single('file'), createSyllabus)
  .get(getSyllabi);

router.route('/download/:id')
  .get(downloadSyllabus);

router.route('/:id')
  .delete(deleteSyllabus);

module.exports = router;
