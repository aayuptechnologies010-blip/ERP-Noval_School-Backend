const express = require('express');
const router = express.Router();
const { getAllMedia, getMediaById, createMedia, updateMedia, deleteMedia } = require('../controllers/mediaController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadSingle } = require('../middlewares/uploadMiddleware');

router.use(protect);

router.route('/')
  .get(getAllMedia)
  .post(uploadSingle.single('file'), createMedia);

router.route('/:id')
  .get(getMediaById)
  .put(uploadSingle.single('file'), updateMedia)
  .delete(deleteMedia);

module.exports = router;
