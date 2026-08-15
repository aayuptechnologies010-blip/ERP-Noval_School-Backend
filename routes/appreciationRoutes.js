const express = require('express');
const router = express.Router();
const {
  createAppreciation,
  getAppreciations,
  getAppreciationById,
  updateAppreciation,
  deleteAppreciation
} = require('../controllers/appreciationController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getAppreciations)
  .post(createAppreciation);

router.route('/:id')
  .get(getAppreciationById)
  .put(updateAppreciation)
  .delete(deleteAppreciation);

module.exports = router;
