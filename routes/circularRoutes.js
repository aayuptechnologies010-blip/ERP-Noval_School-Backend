const express = require('express');
const router = express.Router();
const {
  createCircular,
  getAllCirculars,
  getCircularById,
  updateCircular,
  deleteCircular
} = require('../controllers/circularController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadSingle } = require('../middlewares/uploadMiddleware');

router.use(protect);

router.route('/')
  .post(uploadSingle.single('file'), createCircular)
  .get(getAllCirculars);

router.route('/:id')
  .get(getCircularById)
  .put(uploadSingle.single('file'), updateCircular)
  .delete(deleteCircular);

module.exports = router;
