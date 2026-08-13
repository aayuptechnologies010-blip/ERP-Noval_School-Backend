const express = require('express');
const router = express.Router();
const {
  createAlbum,
  getAllAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
  toggleAlbumStatus
} = require('../controllers/albumController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadSingle } = require('../middlewares/uploadMiddleware');

// Protect all album routes
router.use(protect);

router.route('/')
  .post(uploadSingle.single('coverImage'), createAlbum)
  .get(getAllAlbums);

router.route('/:id')
  .get(getAlbumById)
  .put(uploadSingle.single('coverImage'), updateAlbum)
  .delete(deleteAlbum);

router.route('/:id/status')
  .patch(toggleAlbumStatus);

module.exports = router;
