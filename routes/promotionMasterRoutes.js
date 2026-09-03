const express = require('express');
const router = express.Router();
const {
  createPromotionMaster,
  getPromotionMasters,
  getPromotionMasterById,
  updatePromotionMaster,
  deletePromotionMaster
} = require('../controllers/promotionMasterController');

router.route('/')
  .post(createPromotionMaster)
  .get(getPromotionMasters);

router.route('/:id')
  .get(getPromotionMasterById)
  .put(updatePromotionMaster)
  .delete(deletePromotionMaster);

module.exports = router;
