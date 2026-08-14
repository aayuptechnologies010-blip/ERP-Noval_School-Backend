const express = require('express');
const router = express.Router();
const {
  createEBook,
  getAllEBooks,
} = require('../controllers/ebookController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadDocument } = require('../middlewares/uploadMiddleware');

router.use(protect);

router.route('/')
  .post(uploadDocument.single('pdfFile'), createEBook)
  .get(getAllEBooks);

module.exports = router;
