const express = require('express');
const router = express.Router();
const { getAllVideos, getVideoById, createVideo, updateVideo, deleteVideo } = require('../controllers/videoController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadSingle } = require('../middlewares/uploadMiddleware');

router.use(protect);

router.route('/')
  .get(getAllVideos)
  .post(uploadSingle.single('thumbnail'), createVideo);

router.route('/:id')
  .get(getVideoById)
  .put(uploadSingle.single('thumbnail'), updateVideo)
  .delete(deleteVideo);

module.exports = router;
