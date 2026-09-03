const express = require('express');
const router = express.Router();
const { getMappingByGroup, saveMapping } = require('../controllers/feeGroupToHeadController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/:groupId')
  .get(protect, getMappingByGroup);

router.route('/')
  .post(protect, saveMapping);

module.exports = router;
