const express = require('express');
const router = express.Router();
const {
  createReward,
  getRewards,
  getRewardById,
  updateReward,
  deleteReward
} = require('../controllers/rewardController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getRewards)
  .post(createReward);

router.route('/:id')
  .get(getRewardById)
  .put(updateReward)
  .delete(deleteReward);

module.exports = router;
