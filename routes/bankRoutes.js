const express = require('express');
const router = express.Router();
const {
  createBank,
  getBanks,
  getBankById,
  updateBank,
  deleteBank
} = require('../controllers/bankController');
const { protect } = require('../middlewares/authMiddleware');

// Protect all bank routes
router.use(protect);

router.route('/')
  .post(createBank)
  .get(getBanks);

router.route('/:id')
  .get(getBankById)
  .put(updateBank)
  .delete(deleteBank);

module.exports = router;
